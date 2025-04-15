'use client'

import GameStageMenus from '@/components/GameStageMenus'
import GameStageSelector from '@/components/GameStageSelector'
import GameTutorial from '@/components/GameTutorial'
import GameView from '@/components/GameView'
import { Item } from '@/lib/restaurant/item'
import { useSettings } from '@/providers/Settings'
import { useEffect, useState } from 'react'

export default function Game() {
  const settings = useSettings()

  const [stageId, setStageId] = useState<number>(0)
  const [createdItems, setCreatedItems] = useState<Item[]>([])

  useEffect(() => {
    setCreatedItems([])
  }, [stageId])

  const handleItemCreate = (item: Item) => {
    if (!createdItems.some((value) => value.id === item.id)) {
      setCreatedItems((prev) => [...prev, item])
    }
  }

  return (
    <div className="tablet:max-h-none tablet:max-w-none flex max-h-[calc(100dvh-80px)] max-w-[calc(100dvw-32px)] grow items-start gap-16 overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex items-end justify-between">
            <div className="text-primary-light text-32 font-semibold">Sandbox</div>
            <GameStageSelector stageId={stageId} onStageSelect={setStageId} />
          </div>
          <GameView stageId={stageId} onItemCreate={handleItemCreate} />
        </div>
        <GameTutorial />
      </div>
      {settings.data.displayMenuList && (
        <GameStageMenus stageId={stageId} createdItems={createdItems} />
      )}
    </div>
  )
}
