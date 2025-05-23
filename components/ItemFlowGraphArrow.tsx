import Icon from '@/components/Icon'
import { getActionIcon, getActionName } from '@/lib/action-arrow'
import { Arrow } from '@/lib/restaurant/graph'
import { useSettings } from '@/providers/Settings'
import { useTranslations } from 'next-intl'

export default function ItemFlowGraphArrow({ arrow }: { arrow: Arrow }) {
  const settings = useSettings()
  const t = useTranslations()

  const action = arrow.action
  const ActionIcon = getActionIcon(action)

  return (
    <div className="flex shrink-0 translate-y-1/2 flex-col gap-8">
      <div className="bg-primary-light tablet:w-[100px] relative h-2 w-[80px] items-center justify-center rounded-full">
        <div className="bg-primary-light absolute -right-2 bottom-2 h-2 w-12 -translate-y-full rotate-45 rounded-full" />
        <div className="bg-primary-light absolute -right-2 -bottom-2 h-2 w-12 translate-y-full -rotate-45 rounded-full" />
      </div>
      <div className="inline-flex items-center gap-4 self-center">
        <div className="bg-primary-background rounded-4 inline-flex items-center gap-4 self-center px-8 py-4">
          <ActionIcon className="text-primary size-12 shrink-0" />
          <div className="text-primary text-12 shrink-0 font-bold">{getActionName(action, t)}</div>
        </div>
        {settings.data.displayActionTime && action.effort !== null && (
          <div className="inline-flex items-center gap-2 self-center">
            <Icon.Timer className="text-primary-light size-12 shrink-0" />
            <div className="text-primary-light text-12 shrink-0 font-bold">{action.effort}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ItemFlowGraphArrowPlaceholder() {
  return <div className="tablet:w-[100px] h-2 w-[80px] shrink-0"></div>
}
