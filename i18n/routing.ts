import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ko', 'en', 'ja','cn'],
  defaultLocale: 'ko',
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
