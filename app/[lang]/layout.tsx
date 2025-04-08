import { routing } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
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

  if (!routing.locales.includes(lang)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html>
      <NextIntlClientProvider messages={messages}>
        <body>{children}</body>
      </NextIntlClientProvider>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((lang) => ({
    lang,
  }))
}
