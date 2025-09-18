'use client';
import { useState } from 'react';
import Result from '@/components/Result';

export default function Page() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [data, setData] = useState<any>(null);

  const run = async () => {
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text || undefined, url: url || undefined, language: 'ko' })
      });
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
    } catch (e: any) {
      setError(e.message || 'failed');
    } finally { setLoading(false); }
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">뉴스 클리핑 AI Agent</h1>
      <div className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="기사 URL (네이버 뉴스 포함)"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <textarea
          className="w-full h-40 border rounded p-2"
          placeholder="뉴스 본문 붙여넣기 (URL 대신 사용 가능)"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >{loading ? '분석 중…' : '분석 시작'}</button>
        {error && <p className="text-red-600">{error}</p>}
      </div>
      <Result result={data} />
    </main>
  );
}
