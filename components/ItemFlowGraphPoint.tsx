import { Point } from '@/lib/restaurant/graph'
import { useLocale } from 'next-intl'

export default function ItemFlowGraphPoint({ point }: { point: Point }) {
  const locale = useLocale()

  const item = point.item
  const name = item.getName(locale)

  return (
    <div className="bg-primary-background text-12 flex size-48 items-center justify-center rounded-full text-center">
      {name}
    </div>
  )
}

export function ItemFlowGraphPointPlaceholder() {
  return <div className="size-48"></div>
}
