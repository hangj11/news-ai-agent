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
          { role: "system", content: "뉴스 카테고리 분류기" },
          { role: "user", content: `이 기사를 다음 중 하나로 분류해줘: 정치, 경제, 사회, 문화, IT, 스포츠\n\n본문: ${text}` }
        ]
      }),
    });

    if (!r.ok) {
      return new Response(JSON.stringify({ error: "OpenAI 호출 실패" }), { status: 500 });
    }

    const data = await r.json();
    const label = data.choices?.[0]?.message?.content?.trim() || "기타";

    return new Response(JSON.stringify({ label }), { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

