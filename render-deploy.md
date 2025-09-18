# Render로 n8n 배포하기

## 1. Render 계정 생성
- https://render.com 접속
- GitHub 계정으로 로그인

## 2. 새 Web Service 생성
- "New" → "Web Service" 클릭
- GitHub 리포지토리 연결 (또는 새 리포지토리 생성)

## 3. Dockerfile 생성
프로젝트 루트에 `Dockerfile` 생성:

```dockerfile
FROM n8nio/n8n:latest

# 환경변수 설정
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=your-password
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=3000

EXPOSE 3000
```

## 4. Render 설정
- **Build Command**: `echo "No build needed"`
- **Start Command**: `n8n start`
- **Environment**: `Docker`

## 5. 환경변수 설정
Render Dashboard → Environment 탭:

```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-password
N8N_HOST=0.0.0.0
N8N_PORT=3000
```

## 6. 배포 완료
- 자동 배포 시작
- 배포 완료 후: `https://your-app.onrender.com`
- 웹훅 URL: `https://your-app.onrender.com/webhook/news-analyze`

