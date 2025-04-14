import GameRenderer from '@/components/GameRenderer'
import { Application } from '@pixi/react'
import { useRef } from 'react'

export default function GameView({ stageId }: { stageId: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="rounded-16 border-primary-background relative h-[600px] w-[900px] overflow-hidden border-2"
      onContextMenu={(e) => e.preventDefault()}
      ref={wrapperRef}
    >
      <Application resizeTo={wrapperRef} backgroundAlpha={0} antialias={true} resolution={1}>
        <GameRenderer stageId={stageId} />
      </Application>
    </div>
  )
}
