import Icon from '@/components/Icon'
import { Item } from '@/lib/restaurant/item'
import { FlowLine } from '@/lib/restaurant/solution'
import { useLocale } from 'next-intl'

interface Props {
  item: Item
  flowLines: FlowLine[]
}

export default function MenuItem({ item, flowLines }: Props) {
  const locale = useLocale()

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
    </div>
  )
}
