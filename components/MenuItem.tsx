import Icon from '@/components/Icon'
import ItemFlowGraph from '@/components/ItemFlowGraph'
import { getItemColor, getItemTextColor } from '@/lib/item-color'
import { Item } from '@/lib/restaurant/item'
import { FlowLine } from '@/lib/restaurant/solution'
import { useSettings } from '@/providers/Settings'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

export enum MenuItemType {
  Menu,
  HazardMenu,
  WeaverMenu,
  AdditionalStageMenu,
}

export default function MenuItem({
  item,
  flowLines,
  type,
}: {
  item: Item
  flowLines: FlowLine[]
  type: MenuItemType
}) {
  const t = useTranslations()

  const locale = useLocale()
  const settings = useSettings()

  const [flowLineIndex, setFlowLineIndex] = useState<number>(0)

  const handleNextClick = () => {
    const nextIndex = (flowLineIndex + 1) % flowLines.length
    setFlowLineIndex(nextIndex)
  }

  const handlePrevClick = () => {
    const prevIndex = (flowLineIndex - 1 + flowLines.length) % flowLines.length
    setFlowLineIndex(prevIndex)
  }

  const flowLine = flowLines[flowLineIndex]
  if (!flowLine) return null

  const displayAlternative = settings.data.displayAlternative && flowLines.length > 1

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-0">
        <div className="flex items-end gap-12">
          <div className="text-gray text-24 tablet:text-32 font-bold">{item.getName(locale)}</div>
          {displayAlternative && (
            <div className="mb-6 flex items-center gap-4">
              <div className="-m-4 cursor-pointer p-4" onClick={handlePrevClick}>
                <Icon.LeftChevron className="text-light-gray-hover size-20" />
              </div>
              <div className="flex items-center gap-12">
                <div className="text-gray text-18 font-semibold">{flowLineIndex + 1}</div>
                <div className="text-light-gray-hover text-18 font-medium">/</div>
                <div className="text-light-gray-hover text-18 font-medium">{flowLines.length}</div>
              </div>
              <div className="-m-4 cursor-pointer p-4" onClick={handleNextClick}>
                <Icon.RightChevron className="text-light-gray-hover size-20" />
              </div>
            </div>
          )}
        </div>
        {(type === MenuItemType.WeaverMenu || type === MenuItemType.AdditionalStageMenu) && (
          <div className="mb-16 flex items-center gap-4">
            <div className="text-14 text-gray font-semibold">{t('providedByCustomers')}:</div>
            <div className="flex flex-wrap items-center gap-4">
              {item.getAdditionalItems().map((additionalItem) => (
                <div
                  key={additionalItem.id}
                  style={{
                    background: getItemColor(additionalItem),
                    color: getItemTextColor(additionalItem),
                  }}
                  className="rounded-4 text-12 px-4 py-2 font-semibold opacity-70"
                >
                  {additionalItem.getName(locale)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {flowLine && <ItemFlowGraph flowLine={flowLine} />}
    </div>
  )
}
