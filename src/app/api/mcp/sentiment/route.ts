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
          { role: "system", content: "뉴스 감성 분석기" },
          { role: "user", content: `다음 기사 내용의 감성을 긍정/부정/중립 중 하나로 판단해줘:\n\n${text}` }
        ]
      }),
    });

    if (!r.ok) {
      return new Response(JSON.stringify({ error: "OpenAI 호출 실패" }), { status: 500 });
    }

    const data = await r.json();
    const label = data.choices?.[0]?.message?.content?.trim() || "중립";

    return new Response(JSON.stringify({ label }), { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

