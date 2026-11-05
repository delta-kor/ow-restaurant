'use client'
import { usePathname, useRouter } from '@/i18n/routing'
import { Locale, locales } from '@/lib/restaurant/catalog'
import { useLocale } from 'next-intl'
import SelectMenu from './SelectMenu'
const labels = ['한국어', 'English', '日本語', '简体中文', '繁體中文']
export default function LanguageSelector() {
  const locale = useLocale(),
    pathname = usePathname(),
    router = useRouter()
  return (
    <SelectMenu
      label="Language"
      value={locale}
      options={locales.map((value, i) => ({ value, label: labels[i] }))}
      onChange={(value) =>
        router.replace(pathname + window.location.search, { locale: value as Locale })
      }
    />
  )
}
