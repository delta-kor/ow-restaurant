import ItemFlowGraphArrow, { ItemFlowGraphArrowPlaceholder } from '@/components/ItemFlowGraphArrow'
import ItemFlowGraphMerge from '@/components/ItemFlowGraphMerge'
import ItemFlowGraphPoint, { ItemFlowGraphPointPlaceholder } from '@/components/ItemFlowGraphPoint'
import { FlowGraph } from '@/lib/restaurant/graph'
import { FlowLine } from '@/lib/restaurant/solution'
import { Effect } from 'effect'

export default function ItemFlowGraph({ flowLine }: { flowLine: FlowLine }) {
  const graph = new FlowGraph(flowLine)
  const matrix = graph.create().pipe(Effect.runSync)

  return (
    <div className="flow-graph -mt-16 overflow-x-scroll pt-16 pb-16">
      <div className="flex flex-col gap-20">
        {matrix.map((layer, layerIndex) => (
          <div key={layerIndex} className="flex items-center gap-12">
            {layer.map((cell, cellIndex) => {
              if (cell === null) {
                if (cellIndex % 2 === 0) {
                  return <ItemFlowGraphPointPlaceholder key={cellIndex} />
                } else {
                  return <ItemFlowGraphArrowPlaceholder key={cellIndex} />
                }
              }

              if (cell.type === 'point') {
                return <ItemFlowGraphPoint key={cellIndex} point={cell} />
              }

              if (cell.type === 'arrow') {
                return <ItemFlowGraphArrow key={cellIndex} arrow={cell} />
              }

              if (cell.type === 'merge') {
                return <ItemFlowGraphMerge key={cellIndex} merge={cell} index={layerIndex} />
              }
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
