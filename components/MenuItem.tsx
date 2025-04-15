import Icon from '@/components/Icon'
import ItemFlowGraph from '@/components/ItemFlowGraph'
import { getItemColor, getItemTextColor } from '@/lib/item-color'
import { Item } from '@/lib/restaurant/item'
import { FlowLine } from '@/lib/restaurant/solution'
import { useSettings } from '@/providers/Settings'
import { useLocale, useTranslations } from 'next-intl'

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

  const flowLine = flowLines[0]
  if (!flowLine) return null

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-12">
          <div className="text-gray text-24 tablet:text-32 font-bold">{item.getName(locale)}</div>
          {settings.data.displayAlternative && flowLines.length > 1 && (
            <div className="bg-primary-light rounded-4 text-12 flex items-center gap-2 px-4 py-2 text-white">
              <div className="leading-[14px]">+{flowLines.length - 1}</div>
              <Icon.RightChevron className="size-12" />
            </div>
          )}
        </div>
        {(type === MenuItemType.WeaverMenu || type === MenuItemType.AdditionalStageMenu) && (
          <div className="mb-16 flex items-center gap-4">
            <div className="text-14 text-gray font-semibold">{t('providedByCustomers')}:</div>
            <div className="flex items-center gap-4">
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
