import GameRenderer from '@/components/GameRenderer'
import { Application } from '@pixi/react'
import { useRef } from 'react'

export default function GameView({ stageId }: { stageId: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="rounded-16 border-primary-background relative w-full grow overflow-hidden border-2"
      ref={wrapperRef}
    >
      <Application resizeTo={wrapperRef} backgroundAlpha={0}>
        <GameRenderer stageId={stageId} />
      </Application>
    </div>
  )
}
