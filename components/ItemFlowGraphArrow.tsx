import { getActionIcon, getActionName } from '@/lib/action-arrow'
import { Arrow } from '@/lib/restaurant/graph'
import { useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export default async function ItemFlowGraphArrow({ arrow }: { arrow: Arrow }) {
  const locale = useLocale()
  const t = await getTranslations()

  const action = arrow.action
  const Icon = getActionIcon(action)

  return (
    <div className="flex translate-y-1/2 flex-col gap-8">
      <div className="bg-primary-light h-2 w-[100px] items-center justify-center rounded-full" />
      <div className="bg-primary-background rounded-4 inline-flex items-center gap-4 self-center px-8 py-4">
        <Icon className="text-primary size-12 shrink-0" />
        <div className="text-primary text-12 shrink-0 font-bold">{getActionName(action, t)}</div>
      </div>
    </div>
  )
}

export function ItemFlowGraphArrowPlaceholder() {
  return <div className="h-2 w-[100px]"></div>
}
