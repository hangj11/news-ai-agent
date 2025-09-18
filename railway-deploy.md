# Railway로 n8n 배포하기

## 1. Railway 계정 생성
- https://railway.app 접속
- GitHub 계정으로 로그인

## 2. 새 프로젝트 생성
- "New Project" 클릭
- "Deploy from GitHub repo" 선택
- 또는 "Deploy from template" → "n8n" 선택

## 3. 환경변수 설정
Railway Dashboard → Variables 탭에서 설정:

```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-password
N8N_HOST=0.0.0.0
N8N_PORT=3000
WEBHOOK_URL=https://your-app.railway.app
```

## 4. 배포 완료
- 자동으로 배포 시작
- 배포 완료 후 제공되는 URL로 접속
- 웹훅 URL: `https://your-app.railway.app/webhook/news-analyze`

## 5. 워크플로우 Import
- n8n 웹 인터페이스에서 `workflow.newsAgent.json` Import
- 웹훅 노드 활성화

