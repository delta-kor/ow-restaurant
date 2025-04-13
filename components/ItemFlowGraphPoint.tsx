import { Point } from '@/lib/restaurant/graph'
import { useLocale } from 'next-intl'

export default function ItemFlowGraphPoint({ point }: { point: Point }) {
  const locale = useLocale()

  const item = point.item
  const name = item.getName(locale)

  return (
    <div className="bg-primary-background text-12 flex size-56 shrink-0 items-center justify-center rounded-full text-center font-semibold text-black">
      {name}
    </div>
  )
}

export function ItemFlowGraphPointPlaceholder() {
  return <div className="size-56 shrink-0"></div>
}
