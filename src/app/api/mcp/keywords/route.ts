import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "뉴스 키워드 추출기" },
          { role: "user", content: `이 기사에서 핵심 키워드 5~8개를 JSON 배열로 출력해줘.\n\n${text}` }
        ]
      }),
    });

    if (!r.ok) {
      return new Response(JSON.stringify({ error: "OpenAI 호출 실패" }), { status: 500 });
    }

    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content || "[]";
    let keywords: string[] = [];

    try { 
      keywords = JSON.parse(raw); 
    } catch { 
      keywords = raw.split(/[ ,\n]+/).filter((k: string) => k.trim().length > 0); 
    }

    return new Response(JSON.stringify({ keywords }), { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

