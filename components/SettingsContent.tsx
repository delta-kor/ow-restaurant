'use client'

import Icon from '@/components/Icon'
import { usePathname, useRouter } from '@/i18n/routing'
import { useSettings } from '@/providers/Settings'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'

const LocaleOptions = [
  ['ko', '한국어'],
  ['en', 'English'],
  ['ja', '日本語'],
]

export default function SettingsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const settings = useSettings()
  const [isPending, startTransition] = useTransition()
  const params = useParams()

  const handleLocaleChange = (lang: string) => {
    startTransition(() => {
      // @ts-expect-error
      router.replace({ pathname, params }, { lang })
    })
  }

  return (
    <div className="tablet:pt-tablet-y-padding pc:pt-pc-y-padding pt-mobile-y-padding grow">
      <div className="flex flex-col gap-32">
        <div className="text-48 text-primary-light font-bold">설정</div>
        <div className="flex flex-col gap-56">
          <div className="flex flex-col gap-8">
            <div className="text-18 text-primary font-bold">언어</div>
            <div className="flex items-center gap-16">
              {LocaleOptions.map(([lang, name]) => (
                <div
                  key={lang}
                  onClick={() => handleLocaleChange(lang)}
                  className="rounded-8 border-primary-light bg-primary-background flex w-128 cursor-pointer items-center justify-between gap-8 px-12 py-8 data-[active=true]:border-2"
                  data-active={locale === lang}
                >
                  <div className="text-14 font-medium text-black">{name}</div>
                  <Icon.RightChevron className="text-gray size-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
