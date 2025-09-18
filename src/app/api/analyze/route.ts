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
    const body = await req.json();
    const input = Schema.parse(body);

    // 1) (선택) n8n 전처리: URL → 본문 추출/클린징
    const pre = await callN8N({ stage: 'preprocess', input });
    const baseText = pre?.text ?? input.text ?? '';

    // 2) MCP 병렬 호출 (Vercel API Routes)
    const [sum, cat, sen, key, rel] = await Promise.all([
      fetch(`${process.env.MCP_SERVER_URL}/summarize`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ text: baseText, lang: input.language }) 
      }).then(r => r.json()),
      fetch(`${process.env.MCP_SERVER_URL}/classify`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ text: baseText }) 
      }).then(r => r.json()),
      fetch(`${process.env.MCP_SERVER_URL}/sentiment`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ text: baseText }) 
      }).then(r => r.json()),
      fetch(`${process.env.MCP_SERVER_URL}/keywords`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ text: baseText }) 
      }).then(r => r.json()),
      fetch(`${process.env.MCP_SERVER_URL}/related`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ text: baseText }) 
      }).then(r => r.json())
    ]);

    // 3) (선택) n8n 후처리: 저장/알림/메타 추가
    const post = await callN8N({ stage: 'postprocess', result: { sum, cat, sen, key, rel } });

    return new Response(JSON.stringify({
      summary: sum,
      category: cat.label,
      sentiment: sen.label,
      keywords: key.keywords,
      related: rel.items,
      meta: post?.meta
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'analyze_failed' }), { status: 400 });
  }
}
