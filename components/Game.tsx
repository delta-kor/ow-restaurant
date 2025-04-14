'use client'

import GameStageSelector from '@/components/GameStageSelector'
import { recipe } from '@/lib/restaurant/restaurant'
import { Effect } from 'effect'
import { useLocale } from 'next-intl'
import { useRef, useState } from 'react'

export default function Game() {
  const locale = useLocale()
  const [stageId, setStageId] = useState<number>(0)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const fridge = stage.fridge

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-end justify-between">
        <div className="text-primary-light text-32 font-semibold">Sandbox</div>
        <GameStageSelector stageId={stageId} onStageSelect={setStageId} />
      </div>
      <div
        className="rounded-16 border-primary-background relative w-full grow border-2"
        ref={wrapperRef}
      ></div>
    </div>
  )
}
