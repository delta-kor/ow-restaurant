import { routing } from '@/i18n/routing'
import SettingsProvider from '@/providers/Settings'
import { GoogleAnalytics } from '@next/third-parties/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: never }>
}) {
  const { lang } = await params
  setRequestLocale(lang)

  if (!routing.locales.includes(lang)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html>
      <NextIntlClientProvider messages={messages}>
        <body>
          <SettingsProvider>{children}</SettingsProvider>
        </body>
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID || ''} />
      </NextIntlClientProvider>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((lang) => ({
    lang,
  }))
}
