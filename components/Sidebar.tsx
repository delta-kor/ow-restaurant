'use client'

import { Link, usePathname } from '@/i18n/routing'
import Icon, { IconType } from './Icon'

const MenuList: [IconType, string | null][] = [
  [Icon.Book, null],
  [Icon.Game, '/game'],
  [Icon.Settings, '/settings'],
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="left-pc-x-padding fixed top-1/2 -translate-y-1/2">
      <div className="rounded-16 bg-primary-background flex flex-col gap-40 px-24 py-32">
        {MenuList.map(([Icon, path]) => (
          <Link key={path} href={path || '/'} className="-m-20 p-20" prefetch>
            <Icon
              className="text-primary-light data-[active=true]:text-primary size-48 transition-colors"
              data-active={
                path ? pathname.startsWith(path) : pathname === '/' || pathname.startsWith('/book')
              }
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function SidebarPlaceholder() {
  return <div className="w-96 shrink-0"></div>
}
