import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, lang = "ko" } = await req.json();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "뉴스 요약 도우미" },
          { role: "user", content: `이 텍스트를 ${lang}로 간결하게 요약해줘: ${text}` }
        ]
      }),
    });

    if (!r.ok) {
      return new Response(JSON.stringify({ error: "OpenAI 호출 실패" }), { status: 500 });
    }

    const data = await r.json();
    const output = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({
      oneLine: output.split("\n")[0],
      long: output
    }), { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

