'use client'

import GameStageSelector from '@/components/GameStageSelector'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const DynamicGameView = dynamic(() => import('@/components/GameView'), { ssr: false })

export default function Game() {
  const [stageId, setStageId] = useState<number>(0)

  return (
    <div className="flex flex-col">
      <div className="flex items-end justify-between">
        <div className="text-primary-light text-32 font-semibold">Sandbox</div>
        <GameStageSelector stageId={stageId} onStageSelect={setStageId} />
      </div>
      <DynamicGameView stageId={stageId} />
    </div>
  )
}
