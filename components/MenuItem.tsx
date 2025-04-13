import Icon from '@/components/Icon'
import ItemFlowGraph from '@/components/ItemFlowGraph'
import { Item } from '@/lib/restaurant/item'
import { FlowLine } from '@/lib/restaurant/solution'
import { useLocale } from 'next-intl'

export default function MenuItem({ item, flowLines }: { item: Item; flowLines: FlowLine[] }) {
  const locale = useLocale()

  const flowLine = flowLines[0]

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center gap-12">
        <div className="text-gray text-32 font-bold">{item.getName(locale)}</div>
        {flowLines.length > 1 && (
          <div className="bg-primary-light rounded-4 text-12 flex items-center gap-2 px-4 py-2 text-white">
            <div className="leading-[14px]">+{flowLines.length - 1}</div>
            <Icon.RightChevron className="size-12" />
          </div>
        )}
      </div>
      <ItemFlowGraph flowLine={flowLine} />
    </div>
  )
}
