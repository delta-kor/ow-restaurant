import { Merge } from '@/lib/restaurant/graph'

export default async function ItemFlowGraphMerge({
  merge,
  index,
}: {
  merge: Merge
  index: number
}) {
  const mergeIndex = merge.mergeIndex
  const delta = index - mergeIndex

  const pointSize = 56
  const layerGap = 20
  const height = pointSize / 2 + (layerGap + pointSize) * (delta - 1)

  return (
    <div className="relative w-[100px] shrink-0">
      <div className="bg-primary-light h-2 w-[50px] rounded-full"></div>
      <div
        style={{ height: `${height}px` }}
        className="bg-primary-light absolute bottom-0 left-1/2 w-2 -translate-x-1/2 rounded-full"
      >
        <div className="bg-primary-light absolute top-1 -left-2 h-2 w-12 rotate-45 rounded-full" />
        <div className="bg-primary-light absolute top-1 -right-2 h-2 w-12 -rotate-45 rounded-full" />
      </div>
    </div>
  )
}
