# Fly.io로 n8n 배포하기

## 1. Fly.io CLI 설치
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# 또는 Chocolatey
choco install flyctl
```

## 2. Fly.io 로그인
```bash
fly auth login
```

## 3. fly.toml 설정 파일 생성
프로젝트 루트에 `fly.toml` 생성:

```toml
app = "your-n8n-app"
primary_region = "icn"  # 서울 리전

[build]

[env]
  N8N_BASIC_AUTH_ACTIVE = "true"
  N8N_BASIC_AUTH_USER = "admin"
  N8N_BASIC_AUTH_PASSWORD = "your-password"
  N8N_HOST = "0.0.0.0"
  N8N_PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

## 4. Dockerfile 생성
```dockerfile
FROM n8nio/n8n:latest

EXPOSE 3000
```

## 5. 배포 실행
```bash
fly deploy
```

## 6. 배포 완료
- 웹훅 URL: `https://your-n8n-app.fly.dev/webhook/news-analyze`

