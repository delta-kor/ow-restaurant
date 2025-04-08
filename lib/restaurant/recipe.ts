import { Action, ActionType } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { Effect, Schema } from 'effect'

export interface RecipeJson {
  items: ItemJson[]
  actions: ActionJson[]
}

export interface ActionJson {
  type: ActionType
  input: number[]
  output: number[]
  effort: number | null
}

export interface ItemJson {
  id: number
  name: string[]
}

export class RecipeItemNotFoundError extends Schema.TaggedError<RecipeItemNotFoundError>()(
  'RecipeItemNotFoundError',
  { itemId: Schema.Number }
) {}

export class Recipe {
  public static create(json: RecipeJson) {
    const items = json.items.map(
      (item) =>
        new Item({
          id: item.id,
          koreanName: item.name[0],
          englishName: item.name[1],
          japaneseName: item.name[2],
        })
    )

    const actions = json.actions.map(
      (action) =>
        new Action({
          type: action.type,
          input: action.input.map((id) => items.find((value) => value.id === id)),
          output: action.output.map((id) => items.find((value) => value.id === id)),
          effort: action.effort,
        } as any)
    )

    return new Recipe(items, actions)
  }

  private constructor(
    private readonly items: Item[],
    private readonly actions: Action[]
  ) {}

  public getItem(id: number) {
    return Effect.gen(this, function* (this: Recipe) {
      const item = this.items.find((item) => item.id === id)
      if (!item) return yield* Effect.fail(new RecipeItemNotFoundError({ itemId: id }))

      return item
    })
  }
}
