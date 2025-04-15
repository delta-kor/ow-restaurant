import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { Effect } from 'effect'
import { useLocale } from 'next-intl'

export default function GameStageMenus({
  stageId,
  createdItems,
}: {
  stageId: number
  createdItems: Item[]
}) {
  const locale = useLocale()

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge

  const menus = [...new Set(stage.menus)]
  const hazardMenus = stage.hazardMenus.filter(
    (item) => item.id !== 0 && !fridge.some((value) => value.id === item.id)
  )

  return (
    <div className="@container min-w-0 grow">
      <div className="@container hidden flex-col gap-4 @min-[128px]:flex">
        <div className="-mb-4 h-48" />
        <div className="border-primary-background rounded-16 no-scrollbar flex h-[600px] flex-col gap-8 self-stretch overflow-y-scroll border-2 p-16">
          <div className="grid grid-cols-1 gap-8 @min-[256px]:grid-cols-2 @min-[512px]:grid-cols-3">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="text-14 text-gray data-[finish=true]:text-light-gray-hover font-semibold data-[finish=true]:line-through"
                data-finish={createdItems.some((value) => value.id === menu.id)}
              >
                {menu.getName(locale)}
              </div>
            ))}
          </div>
          <div className="bg-primary-background h-2 shrink-0" />
          <div className="grid grid-cols-1 gap-8 @min-[256px]:grid-cols-2 @min-[512px]:grid-cols-3">
            {hazardMenus.map((menu, index) => (
              <div
                key={menu.id}
                className="text-14 text-gray data-[finish=true]:text-light-gray-hover font-semibold data-[finish=true]:line-through"
                data-finish={createdItems.some((value) => value.id === menu.id)}
              >
                {menu.getName(locale)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
