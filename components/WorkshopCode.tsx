'use client'
import { Link } from '@/i18n/routing'
import { bookHref } from '@/lib/restaurant/catalog'
import { useLocale, useTranslations } from 'next-intl'
import Icon from './Icon'
export default function WorkshopCode() {
  const t = useTranslations(),
    locale = useLocale()
  const defaults: Record<string, string> = { ko: 'SPXXM', en: 'HTNZ3', ja: '4ND1P' }
  const code = defaults[locale] ?? defaults.en
  const rows = [
    { name: t('default'), code, href: bookHref('default-classic') },
    { name: t('joseonEdition'), code: 'WM3MW', href: bookHref('joseon-third') },
    { name: t('thirdEdition'), code: 'ST6Z6', href: bookHref('third') },
  ]
  return (
    <div className="flex max-w-[560px] flex-col gap-8">
      <div className="text-gray text-16 font-bold">{t('workshopCode')}</div>
      {rows.map((row) => (
        <div key={row.href} className="flex flex-wrap items-center justify-between gap-12">
          <Link
            href={row.href}
            className="text-primary-light text-18 font-semibold underline underline-offset-4"
          >
            {row.name}
          </Link>
          <button
            type="button"
            className="text-primary flex items-center gap-8 font-bold"
            aria-label={`${t('copyCode')} ${row.code}`}
            onClick={() =>
              navigator.clipboard
                .writeText(row.code)
                .then(() => alert(t('copiedCode')))
                .catch(() => {})
            }
          >
            {row.code}
            <Icon.Copy className="size-20" />
          </button>
        </div>
      ))}
    </div>
  )
}
