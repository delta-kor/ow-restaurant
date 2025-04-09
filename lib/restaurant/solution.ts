import { Action } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { RecipeService } from '@/lib/restaurant/recipe'
import { Effect } from 'effect'

export type Sequence = Action[]
export interface FlowLine {
  sequence: Sequence
  effort: number
}

export class Solution {
  public static solve(target: Item, ingredients: Item[]) {
    return Effect.gen(function* () {
      const sequences = yield* Solution.getAllActionListFromItem(target)
      const filteredSequences = yield* Solution.filterSequencesWithIngredients(
        sequences,
        ingredients
      )

      const flowLines: FlowLine[] = []
      for (const sequence of filteredSequences) {
        const flowLine = yield* Solution.createFlowLine(sequence)
        flowLines.push(flowLine)
      }

      flowLines.sort((a, b) => a.effort - b.effort)

      return flowLines
    })
  }

  private static getActionsFromOutputItem(item: Item) {
    return Effect.gen(function* () {
      const recipe = yield* RecipeService
      const actions = yield* recipe.getAllActions()
      return actions.filter((action) => !!action.output.find((value) => value.id === item.id))
    })
  }

  private static isItemIngredient(item: Item) {
    return Effect.gen(function* () {
      const actions = yield* Solution.getActionsFromOutputItem(item)
      return actions.length === 0
    })
  }

  private static getMissingItemFromSequence(sequence: Sequence) {
    return Effect.gen(function* () {
      for (const action of sequence) {
        const input = action.input
        for (const inputItem of input) {
          if (yield* Solution.isItemIngredient(inputItem)) continue
          if (
            !sequence.some((action) => !!action.output.find((value) => value.id === inputItem.id))
          ) {
            return inputItem
          }
        }
      }

      return null
    })
  }

  private static getAllActionListFromItem(
    item: Item,
    lastSequence?: Sequence
  ): Effect.Effect<Sequence[], never, RecipeService> {
    return Effect.gen(function* () {
      const newSequences: Sequence[] = []
      const currentSequences: Sequence[] = []

      const actions = yield* Solution.getActionsFromOutputItem(item)
      for (const action of actions) {
        if (typeof lastSequence !== 'undefined') {
          currentSequences.push([action, ...lastSequence])
        } else {
          currentSequences.push([action])
        }
      }

      for (const sequence of currentSequences) {
        const missingItem = yield* Solution.getMissingItemFromSequence(sequence)
        if (!missingItem) {
          newSequences.push(sequence)
          continue
        }

        const mergedSequences = yield* Solution.getAllActionListFromItem(missingItem, sequence)
        newSequences.push(...mergedSequences)
      }

      return newSequences
    })
  }

  private static filterSequencesWithIngredients(
    sequences: Sequence[],
    ingredients: Item[]
  ): Effect.Effect<Sequence[], never, RecipeService> {
    return Effect.gen(function* () {
      const filteredSequences: Sequence[] = []
      sequenceLoop: for (const sequence of sequences) {
        for (const action of sequence) {
          const input = action.input
          for (const inputItem of input) {
            const isIngredient = yield* Solution.isItemIngredient(inputItem)
            if (isIngredient && !ingredients.some((ingredient) => ingredient.id === inputItem.id)) {
              continue sequenceLoop
            }
          }
        }
        filteredSequences.push(sequence)
      }

      return filteredSequences
    })
  }

  private static createFlowLine(sequence: Sequence) {
    return Effect.gen(function* () {
      let effort: number = 0

      for (const action of sequence) {
        if (action.effort !== null) effort += action.effort
      }

      return {
        sequence,
        effort,
      } as FlowLine
    })
  }
}
