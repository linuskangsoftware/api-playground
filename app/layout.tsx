import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Playground',
  description: 'API Playground Lite is a powerful, browser-based tool for testing and debugging APIs. No accounts, no bloat, just pure functionality that works instantly.'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
