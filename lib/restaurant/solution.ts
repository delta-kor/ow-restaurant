import { Action } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { RecipeService } from '@/lib/restaurant/recipe'
import { Effect } from 'effect'

export type Sequence = Action[]
export interface FlowLine {
  sequence: Sequence
  target: Item
  effort: number
}

export class Solution {
  public static solve(target: Item, ingredients: Item[], isAdditional: boolean) {
    return Effect.gen(function* () {
      const mergedIngredients = [...ingredients]
      if (isAdditional) {
        const additionalItems = target.getAdditionalItems()
        mergedIngredients.push(...additionalItems)
      }

      const sequences = yield* Solution.getAllActionListFromItem(target, mergedIngredients)
      const filteredSequences = yield* Solution.filterSequencesWithIngredients(
        sequences,
        mergedIngredients
      )

      const flowLines: FlowLine[] = []
      for (const sequence of filteredSequences) {
        const flowLine = yield* Solution.createFlowLine(sequence, target)
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

  private static isItemIngredient(item: Item, ingredients: Item[]) {
    return Effect.gen(function* () {
      if (ingredients.some((value) => value.id === item.id)) return true
      const actions = yield* Solution.getActionsFromOutputItem(item)
      return actions.length === 0
    })
  }

  private static getMissingItemFromSequence(sequence: Sequence, ingredients: Item[]) {
    return Effect.gen(function* () {
      for (const action of sequence) {
        const input = action.input
        for (const inputItem of input) {
          if (yield* Solution.isItemIngredient(inputItem, ingredients)) continue
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
    ingredients: Item[],
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
        const missingItem = yield* Solution.getMissingItemFromSequence(sequence, ingredients)
        if (!missingItem) {
          newSequences.push(sequence)
          continue
        }

        const mergedSequences = yield* Solution.getAllActionListFromItem(
          missingItem,
          ingredients,
          sequence
        )
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
            const isIngredient = yield* Solution.isItemIngredient(inputItem, ingredients)
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

  private static createFlowLine(sequence: Sequence, target: Item) {
    return Effect.gen(function* () {
      let effort: number = 0

      for (const action of sequence) {
        if (action.effort !== null) effort += action.effort
      }

      return {
        sequence,
        target,
        effort,
      } satisfies FlowLine
    })
  }
}
