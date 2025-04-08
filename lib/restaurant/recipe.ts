import { Action, ActionType } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { Stage } from '@/lib/restaurant/stage'
import { Context, Effect, Layer, Schema } from 'effect'

export interface RecipeJson {
  items: ItemJson[]
  actions: ActionJson[]
  stages: StageJson[]
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
  canMelt: boolean
}

export interface StageJson {
  id: number
  name: string[]
  fridge: number[]
  menus: number[]
  hazardMenus: number[]
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
          canMelt: item.canMelt,
        })
    )

    const actions = json.actions.map(
      (action) =>
        new Action({
          type: action.type,
          input: action.input.map((id) => items.find((item) => item.id === id)!),
          output: action.output.map((id) => items.find((item) => item.id === id)!),
          effort: action.effort,
        } as any)
    )

    const stages = json.stages.map((stage) => Stage.create(stage, items))

    return new Recipe(items, actions, stages)
  }

  private constructor(
    private readonly items: Item[],
    private readonly actions: Action[],
    public readonly stages: Stage[]
  ) {}

  public getLayer() {
    return Layer.succeed(RecipeService, this)
  }

  public getItem(id: number) {
    return Effect.gen(this, function* (this: Recipe) {
      const item = this.items.find((item) => item.id === id)
      if (!item) return yield* Effect.fail(new RecipeItemNotFoundError({ itemId: id }))

      return item
    })
  }
}

export class RecipeService extends Context.Tag('RecipeService')<RecipeService, Recipe>() {}
