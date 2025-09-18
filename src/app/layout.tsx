import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '뉴스 클리핑 AI Agent',
  description: 'MCP와 n8n을 활용한 뉴스 분석 AI 에이전트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
