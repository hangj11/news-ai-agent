# 뉴스 클리핑 AI Agent

MCP (Model Context Protocol)와 n8n을 활용한 뉴스 분석 AI 에이전트입니다. 뉴스 기사를 자동으로 분석하여 요약, 카테고리 분류, 감성 분석, 키워드 추출, 관련 기사 검색을 수행합니다.

## 🚀 주요 기능

- **뉴스 요약**: 한 줄 요약과 상세 요약 제공
- **카테고리 분류**: 정치, 경제, 사회, 문화, IT, 스포츠 등으로 자동 분류
- **감성 분석**: 긍정, 부정, 중립 감성 분석
- **키워드 추출**: 주요 키워드 자동 추출
- **관련 기사 검색**: 유사한 주제의 관련 기사 추천
- **URL 지원**: 기사 URL을 통한 자동 본문 추출 (n8n 워크플로우 활용)
- **네이버 뉴스 지원**: 네이버 뉴스 URL 입력 시 자동 본문 크롤링

## 🏗️ 기술 스택

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Vercel Serverless Functions
- **AI/ML**: MCP (Model Context Protocol) Provider
- **Workflow**: n8n 워크플로우 자동화
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
news-clipping-vercel/
├─ package.json
├─ tsconfig.json
├─ next.config.mjs
├─ vercel.json
├─ env.example
├─ n8n/
│  └─ workflow.newsAgent.json
└─ src/
   ├─ app/
   │  ├─ api/
   │  │  └─ analyze/route.ts
   │  └─ page.tsx
   ├─ components/
   │  └─ Result.tsx
   └─ lib/
      ├─ mcp.ts
      └─ n8n.ts
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 2. 환경 변수 설정

`env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# n8n 웹훅 URL (로컬 개발 시)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/news-analyze

# MCP Provider 서버 URL
MCP_SERVER_URL=http://localhost:3333

# MCP API 키 (MCP Provider가 OpenAI 등 외부 API를 사용하는 경우에만 필요)
MCP_API_KEY=sk-xxxx
```

### 3. 로컬 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 `http://localhost:3000`을 열어 애플리케이션을 확인하세요.

## 🚀 Vercel 배포

### 1. GitHub에 코드 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel에서 프로젝트 Import

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "New Project" 클릭
3. GitHub 리포지토리 선택
4. Framework Preset: "Next.js" 선택
5. Environment Variables에 다음 값들 추가:
   - `N8N_WEBHOOK_URL=https://<your-n8n-host>/webhook/news-analyze`
   - `MCP_SERVER_URL=https://<your-mcp-host>`
   - `MCP_API_KEY=sk-xxxx` (필요시)

### 3. 배포 완료

Vercel이 자동으로 빌드하고 배포합니다. 배포 완료 후 제공되는 URL로 접속하여 애플리케이션을 사용할 수 있습니다.

## 🔧 n8n 워크플로우 설정

### 1. n8n 인스턴스 설정

n8n 인스턴스가 실행 중이어야 합니다. [n8n Cloud](https://n8n.cloud) 또는 자체 호스팅을 사용할 수 있습니다.

### 2. 워크플로우 Import

`n8n/workflow.newsAgent.json` 파일을 n8n에 import하여 워크플로우를 설정하세요.

### 3. 웹훅 URL 확인

n8n 워크플로우의 Webhook 노드에서 생성된 URL을 복사하여 환경 변수 `N8N_WEBHOOK_URL`에 설정하세요.

### 4. 네이버 뉴스 크롤링 지원

현재 워크플로우는 네이버 뉴스 URL(`news.naver.com`)을 감지하여 자동으로 본문을 추출합니다. 더 정확한 크롤링을 위해서는 n8n에서 **HTTP Request → HTML Extract → Function** 노드 조합을 사용하는 것을 권장합니다.

## 📊 API 사용법

### POST /api/analyze

뉴스 기사를 분석합니다.

**요청 본문:**
```json
{
  "text": "뉴스 본문 텍스트 (선택사항)",
  "url": "뉴스 기사 URL (네이버 뉴스 포함, 선택사항)",
  "language": "ko" // 또는 "en"
}
```

**응답:**
```json
{
  "summary": {
    "oneLine": "한 줄 요약",
    "long": "상세 요약"
  },
  "category": "정치",
  "sentiment": "중립",
  "keywords": ["키워드1", "키워드2"],
  "related": [
    {
      "title": "관련 기사 제목",
      "url": "https://example.com",
      "source": "출처"
    }
  ],
  "meta": {
    "tokens": 1500,
    "model": "mcp-provider",
    "latencyMs": 1200
  }
}
```

## 🔍 MCP Provider 설정

이 애플리케이션은 MCP (Model Context Protocol) Provider와 통신합니다. MCP Provider는 다음 엔드포인트를 제공해야 합니다:

- `POST /tools/nlp.summarize` - 텍스트 요약
- `POST /tools/nlp.classify` - 카테고리 분류
- `POST /tools/nlp.sentiment` - 감성 분석
- `POST /tools/nlp.keywords` - 키워드 추출
- `POST /tools/web.search` - 웹 검색

## 🎨 UI 특징

- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **모던한 UI**: Tailwind CSS를 활용한 깔끔한 디자인
- **사용자 친화적**: 직관적인 인터페이스와 로딩 상태 표시
- **접근성**: 키보드 네비게이션과 스크린 리더 지원

## 🔧 개발 팁

### 로컬 개발 시 주의사항

1. **MCP Provider**: 로컬에서 MCP Provider 서버가 실행 중이어야 합니다.
2. **n8n 워크플로우**: n8n 인스턴스가 실행 중이고 웹훅이 활성화되어 있어야 합니다.
3. **환경 변수**: `.env.local` 파일에 올바른 환경 변수가 설정되어 있어야 합니다.

### URL 크롤링 테스트

- **일반 뉴스 URL**: `https://example.com/news-article` 형태의 URL 테스트
- **네이버 뉴스 URL**: `https://news.naver.com/main/read.nhn?mode=LSD&mid=sec&sid1=100&oid=001&aid=0001234567` 형태의 URL 테스트
- **텍스트 입력**: URL 없이 직접 뉴스 본문을 붙여넣어 테스트

### 디버깅

- 브라우저 개발자 도구의 Network 탭에서 API 호출 상태를 확인할 수 있습니다.
- Vercel Functions 로그를 통해 서버 사이드 에러를 확인할 수 있습니다.
- n8n 워크플로우 실행 로그를 통해 크롤링 과정을 모니터링할 수 있습니다.

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 질문이 있으시면 GitHub Issues를 통해 문의해 주세요.
