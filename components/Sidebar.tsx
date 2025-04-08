'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon, { IconType } from './Icon'

const MenuList: [IconType, string][] = [
  [Icon.Book, '/'],
  [Icon.Game, '/game'],
  [Icon.Settings, '/settings'],
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="left-pc-x-padding fixed top-1/2 -translate-y-1/2">
      <div className="rounded-16 bg-primary-background flex flex-col gap-40 px-24 py-32">
        {MenuList.map(([Icon, path]) => (
          <Link href={path} key={path}>
            <Icon
              className="text-primary-light data-[active=true]:text-primary size-48 transition-colors"
              data-active={pathname === path}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function SidebarPlaceholder() {
  return <div className="w-96"></div>
}
