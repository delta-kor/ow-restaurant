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

export class CompanyLaneNotFoundError extends Schema.TaggedError<CompanyLaneNotFoundError>()(
  'CompanyLaneNotFoundError',
  {}
) {}

export class CompanyLayerNotFoundError extends Schema.TaggedError<CompanyLayerNotFoundError>()(
  'CompanyLayerNotFoundError',
  {}
) {}

export class TargetLaneNotFoundError extends Schema.TaggedError<TargetLaneNotFoundError>()(
  'TargetLaneNotFoundError',
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

export interface Layer extends Lane {
  index: number
  mergeIndex: null | number
}

export interface Point {
  type: 'point'
  item: Item
}

export interface Arrow {
  type: 'arrow'
  action: Action
}

export interface Merge {
  type: 'merge'
  action: Action
  mergeIndex: number
}

export type Cell = Point | Arrow | Merge | null

export class FlowGraph {
  private readonly target: Item
  private readonly actions: Action[]
  private readonly levels: Level[]
  private readonly lanes: Lane[] = []
  private readonly layers: Layer[] = []
  private readonly matrix: Cell[][] = []

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
      yield* this.createLanes()
      yield* this.createLayers()
      yield* this.flattenLayers()
      yield* this.createMatrix()
      return this.matrix
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

  private createLanes() {
    return Effect.gen(this, function* (this: FlowGraph) {
      const targetLevel = this.levels.find((level) =>
        level.segments.some(
          (segment) => segment.type === 'node' && segment.item.id === this.target.id
        )
      )
      if (!targetLevel) return yield* Effect.fail(new TargetLevelNotFoundError())

      const targetLane: Lane = {
        level: targetLevel,
        step: 0,
      }
      this.lanes.push(targetLane)

      const updatedLevels: Level[] = [targetLevel]
      while (updatedLevels.length < this.levels.length) {
        const filteredLevels = this.levels.filter(
          (level) => !updatedLevels.some((updatedLevel) => updatedLevel === level)
        )

        for (const level of filteredLevels) {
          const companyLevel = yield* this.getCompanyLevel(level)
          if (!companyLevel) continue
          if (!updatedLevels.includes(companyLevel)) continue

          const mergeEdge = level.segments.findLast(
            (segment) => segment.type === 'edge' && segment.action.input.length > 1
          ) as Edge
          const companyLevelMergeEdgeIndex = companyLevel.segments.findIndex(
            (segment) => segment.type === 'edge' && segment.action === mergeEdge.action
          )

          const relativeStep = companyLevelMergeEdgeIndex - level.segments.length + 1
          const companyLane = this.lanes.find((lane) => lane.level === companyLevel)
          if (!companyLane) return yield* Effect.fail(new CompanyLaneNotFoundError())

          const step = companyLane.step + relativeStep

          const lane: Lane = {
            level: level,
            step: step,
          }
          this.lanes.push(lane)

          updatedLevels.push(level)
        }
      }
    })
  }

  private createLayers() {
    return Effect.gen(this, function* (this: FlowGraph) {
      const targetLane = this.lanes.find((lane) =>
        lane.level.segments.some(
          (segment) => segment.type === 'node' && segment.item.id === this.target.id
        )
      )
      if (!targetLane) return yield* Effect.fail(new TargetLaneNotFoundError())

      const targetLayer: Layer = {
        level: targetLane.level,
        step: targetLane.step,
        index: 0,
        mergeIndex: null,
      }
      this.layers.push(targetLayer)

      const sortedLane = [...this.lanes]
        .filter((lane) => lane !== targetLane)
        .sort((a, b) => a.step + a.level.segments.length - (b.step + b.level.segments.length))

      for (const lane of sortedLane) {
        const startStep = lane.step
        const endStep = lane.step + lane.level.segments.length - 1

        const occupiedLayerIndexes = yield* this.getOccupiedLayerIndexes(startStep, endStep)

        let index: number = 1
        while (occupiedLayerIndexes.includes(index)) {
          index++
        }

        const layer: Layer = {
          level: lane.level,
          step: lane.step,
          index: index,
          mergeIndex: null,
        }
        this.layers.push(layer)

        yield* this.updateLayers()
      }
    })
  }

  private updateLayers() {
    return Effect.gen(this, function* (this: FlowGraph) {
      for (const layer of this.layers) {
        const companyLayer = yield* this.getCompanyLayer(layer)
        if (!companyLayer) continue

        layer.mergeIndex = companyLayer.index
      }

      for (const layer of this.layers) {
        if (layer.mergeIndex !== null) {
          if (layer.mergeIndex > layer.index) {
            const lastLayerIndex = layer.index
            const newIndex = Math.max(...this.layers.map((layer) => layer.index)) + 1

            for (const targetLayer of this.layers) {
              if (targetLayer.mergeIndex === lastLayerIndex) {
                targetLayer.mergeIndex = newIndex
              }
            }

            layer.index = newIndex
          }
        }
      }

      for (const layer of this.layers.filter((layer) => layer.index !== 0)) {
        const index = layer.index
        const startStep = layer.step
        const endStep = layer.step + layer.level.segments.length - 1
        const occupiedLayerIndexes = yield* this.getOccupiedLayerIndexes(startStep, endStep, layer)

        if (layer.mergeIndex !== null) {
          for (let i = 0; i < layer.mergeIndex; i++) {
            occupiedLayerIndexes.push(i)
          }
        }

        let newIndex: number = 1
        while (occupiedLayerIndexes.includes(newIndex)) {
          newIndex++
        }

        if (newIndex < index) {
          const lastLayerIndex = layer.index
          layer.index = newIndex
          for (const targetLayer of this.layers) {
            if (targetLayer.mergeIndex === lastLayerIndex) {
              targetLayer.mergeIndex = newIndex
            }
          }
        }
      }
    })
  }

  private flattenLayers(): Effect.Effect<void> {
    return Effect.gen(this, function* (this: FlowGraph) {
      const indexes = [...new Set(this.layers.map((layer) => layer.index))]
      const maxIndex = Math.max(...indexes)
      const minIndex = Math.min(...indexes)
      const isContinuous = indexes.length === maxIndex - minIndex + 1
      if (!isContinuous) {
        yield* this.updateLayers()
        yield* this.flattenLayers()
      }
    })
  }

  private createMatrix() {
    return Effect.gen(this, function* (this: FlowGraph) {
      for (const layer of this.layers) {
        const index = layer.index
        const step = layer.step

        let relativeStep: number = 0
        for (const segment of layer.level.segments) {
          let cell: Cell =
            segment.type === 'node'
              ? { type: 'point', item: segment.item }
              : { type: 'arrow', action: segment.action }
          if (
            relativeStep === layer.level.segments.length - 1 &&
            layer.mergeIndex !== null &&
            segment.type === 'edge'
          ) {
            cell = { type: 'merge', action: segment.action, mergeIndex: layer.mergeIndex }
          }

          if (!this.matrix[index]) this.matrix[index] = []
          this.matrix[index][step + relativeStep] = cell

          for (let i = 0; i < this.matrix[index].length; i++) {
            if (!this.matrix[index][i]) {
              this.matrix[index][i] = null
            }
          }

          relativeStep++
        }
      }

      for (let i = 0; i < this.matrix.length; i++) {
        if (!this.matrix[i]) {
          this.matrix[i] = [null]
        }
      }
    })
  }

  private getOccupiedLayerIndexes(startStep: number, endStep: number, excludedLayer?: Layer) {
    return Effect.gen(this, function* (this: FlowGraph) {
      const layers = this.layers.filter((layer) => layer.level !== excludedLayer?.level)

      const occupiedLayers = layers.filter((layer) => {
        const layerStartStep = layer.step
        const layerEndStep = layer.step + layer.level.segments.length - 1
        const isOccupied =
          (layerStartStep >= startStep && layerStartStep <= endStep) ||
          (layerEndStep >= startStep && layerEndStep <= endStep) ||
          (layerStartStep <= startStep && layerEndStep >= endStep)

        return isOccupied
      })

      const occupiedLayerIndexes = occupiedLayers.map((layer) => layer.index)

      for (const layer of layers) {
        if (layer.mergeIndex !== null) {
          const mergeStep = layer.step + layer.level.segments.length - 1
          if (mergeStep >= startStep && mergeStep <= endStep) {
            const layerIndex = layer.index
            const mergeLayerIndex = layer.mergeIndex
            for (let i = mergeLayerIndex; i <= layerIndex; i++) {
              if (!occupiedLayerIndexes.includes(i)) {
                occupiedLayerIndexes.push(i)
              }
            }
          }
        }
      }

      return occupiedLayerIndexes
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

  private getCompanyLevel(level: Level) {
    return Effect.gen(this, function* (this: FlowGraph) {
      const mergeEdge = level.segments.findLast(
        (segment) => segment.type === 'edge' && segment.action.input.length > 1
      ) as Edge
      if (!mergeEdge) return null

      const levels = yield* this.getLevelsFromMergeAction(mergeEdge.action)
      const companyLevel = levels.find((item) => item !== level)
      return companyLevel
    })
  }

  private getCompanyLayer(layer: Layer) {
    return Effect.gen(this, function* (this: FlowGraph) {
      const level = layer.level
      const segments = level.segments
      const mergeEdge = segments[segments.length - 1]
      if (!mergeEdge || mergeEdge.type !== 'edge' || mergeEdge.action.input.length !== 2)
        return null

      const levels = yield* this.getLevelsFromMergeAction(mergeEdge.action)
      const companyLevel = levels.find((item) => item !== level)
      if (!companyLevel) return null

      const companyLayer = this.layers.find((layer) => layer.level === companyLevel)
      if (!companyLayer) return null

      return companyLayer
    })
  }

  private toDebugString() {
    let result: string = ''

    for (const layer of this.layers) {
      const segments = layer.level.segments
      result += `Layer ${layer.index} (Step: ${layer.step} | Merge to: ${layer.mergeIndex ?? 'X'}):\n`
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
