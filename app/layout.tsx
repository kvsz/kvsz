import type { Metadata } from 'next'
import { inter } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'HUB | 07',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} flex min-h-full flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}