import { themeInitScript } from '@/lib/theme'
import { getLocale } from 'next-intl/server'
import React from 'react'
import './globals.css'
import './theme.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
