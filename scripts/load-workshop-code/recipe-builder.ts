import { Effect, Schema } from 'effect'
import { Action, ActionType } from '../../lib/restaurant/action'
import { Item } from '../../lib/restaurant/item'
import { StageJson } from '../../lib/restaurant/recipe'
import { WorkshopConfig } from './code-keys'

export interface RecipeBuilderConfig {
  koreanWorkshopConfig: WorkshopConfig
  englishWorkshopConfig: WorkshopConfig
  japaneseWorkshopConfig: WorkshopConfig
}

export class CuttingActionConfigError extends Schema.TaggedError<CuttingActionConfigError>()(
  'CuttingActionConfigError',
  { itemId: Schema.Number }
) {}

export class GrillingActionConfigError extends Schema.TaggedError<GrillingActionConfigError>()(
  'GrillingActionConfigError',
  { itemId: Schema.Number }
) {}

export class FryingActionConfigError extends Schema.TaggedError<FryingActionConfigError>()(
  'FryingActionConfigError',
  { itemId: Schema.Number }
) {}

export class PotActionConfigError extends Schema.TaggedError<PotActionConfigError>()(
  'PotActionConfigError',
  { itemId: Schema.Number }
) {}

export class PanActionConfigError extends Schema.TaggedError<PanActionConfigError>()(
  'PanActionConfigError',
  { itemId: Schema.Number }
) {}

export class RecipeBuilderItemNotFoundError extends Schema.TaggedError<RecipeBuilderItemNotFoundError>()(
  'RecipeBuilderItemNotFoundError',
  { itemId: Schema.Number }
) {}

export class RecipeBuilder {
  private readonly workshopConfig: WorkshopConfig
  private readonly englishWorkshopConfig: WorkshopConfig
  private readonly japaneseWorkshopConfig: WorkshopConfig

  private readonly items: Set<Item> = new Set()
  private readonly actions: Set<Action> = new Set()

  constructor(recipeBuilderConfig: RecipeBuilderConfig) {
    this.workshopConfig = recipeBuilderConfig.koreanWorkshopConfig
    this.englishWorkshopConfig = recipeBuilderConfig.englishWorkshopConfig
    this.japaneseWorkshopConfig = recipeBuilderConfig.japaneseWorkshopConfig
  }

  public build() {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      yield* this.buildItems()
      yield* this.buildActions()
    })
  }

  private buildItems() {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      this.items.clear()

      const koreanNames = this.workshopConfig.itemName
      const englishNames = this.englishWorkshopConfig.itemName
      const japaneseNames = this.japaneseWorkshopConfig.itemName

      const meltList = this.workshopConfig.meltList
      for (let index = 0; index < koreanNames.length; index++) {
        const koreanName = koreanNames[index]
        const englishName = englishNames[index]
        const japaneseName = japaneseNames[index]

        const item = new Item({
          id: index,
          koreanName,
          englishName,
          japaneseName,
          canMelt: meltList.includes(index),
          colorCode: this.workshopConfig.itemColor[index],
        })
        this.items.add(item)
      }
    })
  }

  private buildActions() {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      this.actions.clear()

      for (const item of this.items) {
        yield* this.updateCuttingAction(item)
        yield* this.updateGrillingAction(item)
        yield* this.updateFryingAction(item)
        yield* this.updatePotAction(item)
        yield* this.updatePanAction(item)
        yield* this.updateImpactAction(item)
      }

      yield* this.updateMixActions()
    })
  }

  private getItem(id: number) {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const item = [...this.items].find((item) => item.id === id)
      if (!item) return yield* Effect.fail(new RecipeBuilderItemNotFoundError({ itemId: id }))

      return item
    })
  }

  private updateCuttingAction(item: Item) {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const id = item.id
      const cuttingNeeded = this.workshopConfig.cuttingNeeded[id]
      const cuttingResult = this.workshopConfig.cuttingResult[id]

      if (typeof cuttingNeeded === 'undefined') {
        yield* Effect.logWarning(`Cutting action not found for item ${item.id}`)
        return null
      }

      if (cuttingNeeded === 99) return null
      if (typeof cuttingResult === 'undefined' || cuttingResult === false)
        return yield* Effect.fail(new CuttingActionConfigError({ itemId: id }))

      let output: Item[]
      if (typeof cuttingResult === 'number') {
        const cuttingResultItem = yield* this.getItem(cuttingResult)
        output = [cuttingResultItem]
      } else if (Array.isArray(cuttingResult)) {
        output = []
        for (const cuttingResultId of cuttingResult) {
          const cuttingResultItem = yield* this.getItem(cuttingResultId)
          output.push(cuttingResultItem)
        }
      } else {
        return yield* Effect.fail(new CuttingActionConfigError({ itemId: id }))
      }

      const action = new Action({
        type: ActionType.Cut,
        effort: cuttingNeeded,
        input: [item],
        output,
      })

      this.actions.add(action)
    })
  }

  private updateGrillingAction(item: Item) {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const id = item.id
      const grillingNeeded = this.workshopConfig.grillingNeeded[id]
      const grillingResult = this.workshopConfig.grillingResult[id]

      if (typeof grillingNeeded === 'undefined') {
        yield* Effect.logWarning(`Grilling action not found for item ${item.id}`)
        return null
      }

      if (typeof grillingResult === 'undefined')
        return yield* Effect.fail(new GrillingActionConfigError({ itemId: id }))
      if (grillingResult === false) return null

      const output = yield* this.getItem(grillingResult)
      const action = new Action({
        type: ActionType.Grill,
        effort: grillingNeeded,
        input: [item],
        output: [output],
      })

      this.actions.add(action)
    })
  }

  private updateFryingAction(item: Item) {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const id = item.id
      const fryingNeeded = this.workshopConfig.fryingNeeded[id]
      const fryingResult = this.workshopConfig.fryingResult[id]

      if (typeof fryingNeeded === 'undefined') {
        yield* Effect.logWarning(`Frying action not found for item ${item.id}`)
        return null
      }

      if (typeof fryingResult === 'undefined')
        return yield* Effect.fail(new FryingActionConfigError({ itemId: id }))
      if (fryingResult === false) return null

      const output = yield* this.getItem(fryingResult)
      const action = new Action({
        type: ActionType.Fry,
        effort: fryingNeeded,
        input: [item],
        output: [output],
      })

      this.actions.add(action)
    })
  }

  private updatePotAction(item: Item) {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const id = item.id
      const potNeeded = this.workshopConfig.potTime[id]
      const potResult = this.workshopConfig.potResult[id]

      if (typeof potNeeded === 'undefined') {
        yield* Effect.logWarning(`Pot action not found for item ${item.id}`)
        return null
      }

      if (potNeeded === false) return null
      if (typeof potResult === 'undefined' || potResult === false)
        return yield* Effect.fail(new PotActionConfigError({ itemId: id }))

      const output = yield* this.getItem(potResult)
      const action = new Action({
        type: ActionType.Pot,
        effort: potNeeded,
        input: [item],
        output: [output],
      })

      this.actions.add(action)
    })
  }

  private updatePanAction(item: Item) {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const id = item.id
      const panNeeded = this.workshopConfig.panNeeded[id]
      const panResult = this.workshopConfig.panResult[id]

      if (typeof panNeeded === 'undefined') {
        yield* Effect.logWarning(`Pan action not found for item ${item.id}`)
        return null
      }

      if (typeof panResult === 'undefined')
        return yield* Effect.fail(new PanActionConfigError({ itemId: id }))
      if (panResult === false) return null

      const output = yield* this.getItem(panResult)
      const action = new Action({
        type: ActionType.Pan,
        effort: panNeeded,
        input: [item],
        output: [output],
      })

      this.actions.add(action)
    })
  }

  private updateImpactAction(item: Item) {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const id = item.id
      const impactResult = this.workshopConfig.impactResult[id]

      if (typeof impactResult === 'undefined') {
        yield* Effect.logWarning(`Impact action not found for item ${item.id}`)
        return null
      }

      if (impactResult === false) return null

      const output = yield* this.getItem(impactResult)
      const action = new Action({
        type: ActionType.Impact,
        input: [item],
        output: [output],
      })

      this.actions.add(action)
    })
  }

  private updateMixActions() {
    return Effect.gen(this, function* (this: RecipeBuilder) {
      const rawMix = this.workshopConfig.rawMix
      const rawResult = this.workshopConfig.rawResult

      for (let index = 0; index < rawMix.length; index++) {
        const rawMixItem = rawMix[index]
        const rawResultItem = rawResult[index]

        const itemAIndex = rawMixItem % 1000
        const itemBIndex = Math.floor(rawMixItem / 1000)

        const itemA = yield* this.getItem(itemAIndex)
        const itemB = yield* this.getItem(itemBIndex)

        const resultItem = yield* this.getItem(rawResultItem)

        const action = new Action({
          type: ActionType.Mix,
          input: [itemA, itemB],
          output: [resultItem],
        })

        this.actions.add(action)
      }
    })
  }

  private createStageJson() {
    const menuList = this.workshopConfig.menuList
    const hazardMenuList = this.workshopConfig.hazardMenuList
    const fridgeList = this.workshopConfig.fridgeList

    const koreanStageName = this.workshopConfig.stageName
    const englishStageName = this.englishWorkshopConfig.stageName
    const japaneseStageName = this.japaneseWorkshopConfig.stageName

    const stages: StageJson[] = []
    for (let id = 0; id < koreanStageName.length; id++) {
      const stage: StageJson = {
        id,
        name: [koreanStageName[id], englishStageName[id], japaneseStageName[id]],
        fridge: fridgeList[id],
        menus: menuList[id],
        hazardMenus: hazardMenuList[id],
      }

      stages.push(stage)
    }

    return stages
  }

  public toJSON() {
    return {
      items: [...this.items].map((item) => item.toJSON()),
      actions: [...this.actions].map((action) => action.toJSON()),
      stages: this.createStageJson(),
    }
  }
}
