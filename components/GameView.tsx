import GameRenderer from '@/components/GameRenderer'
import { Item } from '@/lib/restaurant/item'
import { Application } from '@pixi/react'
import { useRef } from 'react'

export default function GameView({
  stageId,
  onItemCreate,
}: {
  stageId: number
  onItemCreate: (item: Item) => void
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="rounded-16 border-primary-background relative h-[600px] w-[900px] overflow-hidden border-2"
      onContextMenu={(e) => e.preventDefault()}
      ref={wrapperRef}
    >
      <Application resizeTo={wrapperRef} backgroundAlpha={0} antialias={true} resolution={1}>
        <GameRenderer stageId={stageId} onItemCreate={onItemCreate} />
      </Application>
    </div>
  )
}
