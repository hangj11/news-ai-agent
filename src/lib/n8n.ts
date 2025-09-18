export async function callN8N(payload: any) {
  const url = process.env.N8N_WEBHOOK_URL!;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    // Vercel serverless: 외부 호출은 기본 10초 타임아웃 → 필요시 n8n 응답을 가볍게 유지
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`n8n error: ${res.status}`);
  return res.json();
}
