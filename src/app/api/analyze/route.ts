import { NextRequest } from 'next/server';
import { z } from 'zod';
import { callN8N } from '@/lib/n8n';

const Schema = z.object({
  text: z.string().optional(),
  url: z.string().url().optional(),
  language: z.enum(['ko','en']).default('ko')
}).refine(v => !!(v.text || v.url), { message: 'text 또는 url 중 하나는 필수' });

export const runtime = 'nodejs'; // Edge 런타임은 외부 fetch 제한 요소 존재 시 Node 권장
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 환경변수 확인
    if (!process.env.MCP_SERVER_URL) {
      return new Response(JSON.stringify({ error: 'MCP_SERVER_URL not configured' }), { status: 500 });
    }

    const body = await req.json();
    const input = Schema.parse(body);

    // 1) (선택) n8n 전처리: URL → 본문 추출/클린징
    let pre = null;
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        pre = await callN8N({ stage: 'preprocess', input });
      }
    } catch (e) {
      console.warn('n8n preprocess failed:', e);
    }
    
    const baseText = pre?.text ?? input.text ?? '';
    
    if (!baseText) {
      return new Response(JSON.stringify({ error: 'No text content to analyze' }), { status: 400 });
    }

    // 2) MCP 병렬 호출 (Vercel API Routes) - 에러 처리 강화
    const mcpCall = async (endpoint: string, payload: any) => {
      try {
        const res = await fetch(`${process.env.MCP_SERVER_URL}${endpoint}`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.error(`MCP ${endpoint} failed:`, e);
        return null;
      }
    };

    const [sum, cat, sen, key, rel] = await Promise.all([
      mcpCall('/summarize', { text: baseText, lang: input.language }),
      mcpCall('/classify', { text: baseText }),
      mcpCall('/sentiment', { text: baseText }),
      mcpCall('/keywords', { text: baseText }),
      mcpCall('/related', { text: baseText })
    ]);

    // 3) (선택) n8n 후처리: 저장/알림/메타 추가
    let post = null;
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        post = await callN8N({ stage: 'postprocess', result: { sum, cat, sen, key, rel } });
      }
    } catch (e) {
      console.warn('n8n postprocess failed:', e);
    }

    // 안전한 응답 구성
    return new Response(JSON.stringify({
      summary: sum || { oneLine: '요약 실패', long: '요약을 생성할 수 없습니다.' },
      category: cat?.label || '분류 불가',
      sentiment: sen?.label || '감성 분석 불가',
      keywords: key?.keywords || [],
      related: rel?.items || [],
      meta: post?.meta || null
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error('Analyze API error:', e);
    return new Response(JSON.stringify({ 
      error: e.message || 'analyze_failed',
      details: process.env.NODE_ENV === 'development' ? e.stack : undefined
    }), { status: 400 });
  }
}
