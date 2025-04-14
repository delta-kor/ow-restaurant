'use client'

import GameStageSelector from '@/components/GameStageSelector'
import GameTutorial from '@/components/GameTutorial'
import GameView from '@/components/GameView'
import { useState } from 'react'

export default function Game() {
  const [stageId, setStageId] = useState<number>(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex items-end justify-between">
          <div className="text-primary-light text-32 font-semibold">Sandbox</div>
          <GameStageSelector stageId={stageId} onStageSelect={setStageId} />
        </div>
        <GameView stageId={stageId} />
      </div>
      <GameTutorial />
    </div>
  )
}
