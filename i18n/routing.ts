import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ko', 'en', 'ja', 'zh-CN', 'zh-TW'],
  defaultLocale: 'en',
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
