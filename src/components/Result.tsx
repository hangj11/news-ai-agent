export default function Result({ result }: { result: any }) {
  if (!result) return null;
  
  return (
    <div className="space-y-6">
      {/* 요약 섹션 */}
      <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📄 요약</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">한 줄 요약</h4>
            <p className="text-gray-900 leading-relaxed">{result.summary?.oneLine}</p>
          </div>
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 group-open:text-blue-800">
              상세 요약 보기
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{result.summary?.long}</p>
            </div>
          </details>
        </div>
      </div>

      {/* 분석 결과 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="text-sm text-gray-500 mb-2">🏷️ 카테고리</div>
          <div className="text-lg font-bold text-gray-900">{result.category}</div>
        </div>
        
        <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="text-sm text-gray-500 mb-2">😊 감성</div>
          <div className="text-lg font-bold text-gray-900">{result.sentiment}</div>
        </div>
        
        <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="text-sm text-gray-500 mb-2">🔑 키워드</div>
          <div className="flex flex-wrap gap-2">
            {(result.keywords || []).map((k: string) => (
              <span 
                key={k} 
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 관련 기사 섹션 */}
      {Array.isArray(result.related) && result.related.length > 0 && (
        <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 관련 기사</h3>
          <ul className="space-y-3">
            {result.related.map((r: any, index: number) => (
              <li key={r.url || index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <a 
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium block truncate" 
                    href={r.url} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    {r.title}
                  </a>
                  {r.source && (
                    <p className="text-sm text-gray-500 mt-1">{r.source}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 메타 정보 */}
      {result.meta && (
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">분석 정보</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {result.meta.tokens && (
              <div>
                <span className="text-gray-500">토큰:</span>
                <span className="ml-1 font-medium">{result.meta.tokens}</span>
              </div>
            )}
            {result.meta.model && (
              <div>
                <span className="text-gray-500">모델:</span>
                <span className="ml-1 font-medium">{result.meta.model}</span>
              </div>
            )}
            {result.meta.latencyMs && (
              <div>
                <span className="text-gray-500">처리시간:</span>
                <span className="ml-1 font-medium">{result.meta.latencyMs}ms</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
