import { Action } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { FlowLine } from '@/lib/restaurant/solution'
import { Effect, Schema } from 'effect'

export class LevelNotFoundFromItemError extends Schema.TaggedError<LevelNotFoundFromItemError>()(
  'LevelNotFoundFromItemError',
  { itemId: Schema.Number }
) {}

export class InvalidLevelPairError extends Schema.TaggedError<InvalidLevelPairError>()(
  'InvalidLevelPairError',
  {}
) {}

export class TargetLevelNotFoundError extends Schema.TaggedError<TargetLevelNotFoundError>()(
  'TargetLevelNotFoundError',
  {}
) {}

export interface Node {
  type: 'node'
  item: Item
}

export interface Edge {
  type: 'edge'
  action: Action
}

export type Segment = Node | Edge

export interface Level {
  segments: Segment[]
}

export interface Lane {
  level: Level
  step: number
}

export class FlowGraph {
  private readonly target: Item
  private readonly actions: Action[]
  private readonly levels: Level[]
  private readonly lanes: Lane[] = []

  private readonly updatedItems: Item[] = []
  private readonly updatedActions: Action[] = []

  constructor(flowLine: FlowLine) {
    this.target = flowLine.target
    this.actions = flowLine.sequence

    const targetNode: Node = { type: 'node', item: this.target }
    this.levels = [{ segments: [targetNode] }]
  }

  public create() {
    return Effect.gen(this, function* (this: FlowGraph) {
      yield* this.updateLevelsFromTarget()
      yield* this.updateMergePoint()
      console.log(this.toDebugString())

      yield* this.updateLanes()
    })
  }

  private updateLevelsFromTarget(
    items: Item[] = [this.target]
  ): Effect.Effect<void, LevelNotFoundFromItemError> {
    return Effect.gen(this, function* (this: FlowGraph) {
      const filteredItems = items.filter(
        (item) => !this.updatedItems.some((updatedItem) => updatedItem.id === item.id)
      )
      this.updatedItems.push(...filteredItems)

      for (const item of filteredItems) {
        const affectedItems = yield* this.updateLevelsFromItem(item)
        if (affectedItems.length > 0) {
          yield* this.updateLevelsFromTarget(affectedItems)
        }
      }
    })
  }

  private updateLevelsFromItem(item: Item) {
    return Effect.gen(this, function* (this: FlowGraph) {
      const affectedItems: Item[] = []

      const nextAction = yield* this.getActionFromOutputItem(item)
      if (nextAction === null) return affectedItems

      const level = yield* this.getLevelFromItem(item)
      if (!level) return yield* Effect.fail(new LevelNotFoundFromItemError({ itemId: item.id }))

      const nextItems = nextAction.input
      if (nextItems.length === 1) {
        const nextItem = nextItems[0]
        const nextNode: Node = { type: 'node', item: nextItem }
        const nextEdge: Edge = { type: 'edge', action: nextAction }
        level.segments = [nextNode, nextEdge, ...level.segments]
        affectedItems.push(nextItem)
      } else {
        let isFirst: boolean = true
        for (const nextItem of nextItems) {
          const nextNode: Node = { type: 'node', item: nextItem }
          const nextEdge: Edge = { type: 'edge', action: nextAction }

          if (isFirst) {
            level.segments = [nextNode, nextEdge, ...level.segments]
            isFirst = false
          } else {
            const newLevel: Level = { segments: [nextNode, nextEdge] }
            this.levels.push(newLevel)
          }

          affectedItems.push(nextItem)
        }
      }

      return [...new Set(affectedItems)]
    })
  }

  private updateMergePoint(): Effect.Effect<
    void,
    LevelNotFoundFromItemError | InvalidLevelPairError
  > {
    return Effect.gen(this, function* (this: FlowGraph) {
      const mergeActions: Action[] = []

      for (const level of this.levels) {
        const edges = level.segments.filter((segment) => segment.type === 'edge') as Edge[]
        for (const edge of edges) {
          if (edge.action.input.length > 1 && !mergeActions.includes(edge.action)) {
            mergeActions.push(edge.action)
          }
        }
      }

      const filteredMergeActions = mergeActions.filter(
        (action) => !this.updatedActions.includes(action)
      )

      actionLoop: for (const action of filteredMergeActions) {
        const levels = yield* this.getLevelsFromMergeAction(action)
        for (const level of levels) {
          const isClean = yield* this.isLevelClean(level, action)
          if (!isClean) continue actionLoop
        }

        if (levels.length !== 2) {
          return yield* Effect.fail(new InvalidLevelPairError())
        }

        const levelA = levels[0]
        const levelB = levels[1]

        const segmentA = levelA.segments
        const segmentB = levelB.segments

        const mergeActionIndexA = segmentA.findIndex(
          (segment) => segment.type === 'edge' && segment.action === action
        )
        const mergeActionIndexB = segmentB.findIndex(
          (segment) => segment.type === 'edge' && segment.action === action
        )

        const mergeActionEdge = segmentA[mergeActionIndexA] as Edge

        const segmentALeft = segmentA.slice(0, mergeActionIndexA)
        const segmentBLeft = segmentB.slice(0, mergeActionIndexB)

        const segmentARight = segmentA.slice(mergeActionIndexA + 1)
        const segmentBRight = segmentB.slice(mergeActionIndexB + 1)

        const isALeftLarger = segmentALeft.length > segmentBLeft.length
        const isARightLarger = segmentARight.length > segmentBRight.length

        if (!isALeftLarger && isARightLarger) {
          levelA.segments = [...segmentBLeft, mergeActionEdge, ...segmentARight]
          levelB.segments = [...segmentALeft, mergeActionEdge, ...segmentBRight]
        }

        this.updatedActions.push(action)
      }

      if (this.updatedActions.length !== mergeActions.length) yield* this.updateMergePoint()
    })
  }

  private updateLanes() {
    return Effect.gen(this, function* (this: FlowGraph) {
      const targetLevel = this.levels.find((level) =>
        level.segments.some(
          (segment) => segment.type === 'node' && segment.item.id === this.target.id
        )
      )

      if (!targetLevel) return yield* Effect.fail(new TargetLevelNotFoundError())
    })
  }

  private isLevelClean(level: Level, mergeAction: Action) {
    return Effect.gen(this, function* (this: FlowGraph) {
      const edges = level.segments.filter((segment) => segment.type === 'edge') as Edge[]
      const mergeEdges = edges.filter((edge) => edge.action.input.length > 1)
      const filteredEdges = mergeEdges.filter((edge) => !this.updatedActions.includes(edge.action))
      return filteredEdges[0].action === mergeAction
    })
  }

  private getActionFromOutputItem(item: Item) {
    return Effect.gen(this, function* (this: FlowGraph) {
      for (const action of this.actions) {
        if (action.output.some((outputItem) => outputItem.id === item.id)) {
          return action
        }
      }

      return null
    })
  }

  private getLevelFromItem(item: Item) {
    return Effect.gen(this, function* (this: FlowGraph) {
      const level = this.levels.find((level) =>
        level.segments.some((segment) => segment.type === 'node' && segment.item.id === item.id)
      )
      if (level) return level
      return null
    })
  }

  private getLevelsFromMergeAction(action: Action) {
    return Effect.gen(this, function* (this: FlowGraph) {
      const levels: Level[] = []
      for (const level of this.levels) {
        const edges = level.segments.filter((segment) => segment.type === 'edge') as Edge[]
        for (const edge of edges) {
          if (edge.action === action) {
            levels.push(level)
          }
        }
      }

      return levels
    })
  }

  private toDebugString() {
    let result: string = ''

    for (const level of this.levels) {
      const segments = level.segments
      for (const segment of segments) {
        if (segment.type === 'node') {
          result += `${segment.item.getName('ko')}`
        } else {
          result += ` --${segment.action.type}--> `
        }
      }

      result += '\n'
    }

    return result
  }
}
