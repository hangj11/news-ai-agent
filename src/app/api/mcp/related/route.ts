import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // 간단히 네이버 뉴스 검색 대체 (실제 구현은 n8n에 위임 권장)
    return new Response(JSON.stringify({
      items: [
        { title: "관련 기사 예시", url: "https://news.naver.com/example", source: "네이버" }
      ]
    }), { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

