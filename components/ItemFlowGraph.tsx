import { FlowGraph } from '@/lib/restaurant/graph'
import { FlowLine } from '@/lib/restaurant/solution'
import { Effect } from 'effect'

export default function ItemFlowGraph({ flowLine }: { flowLine: FlowLine }) {
  const graph = new FlowGraph(flowLine)
  graph.create().pipe(Effect.runSync)

  return <div></div>
}
