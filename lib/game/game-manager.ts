import GameConstraints from '@/lib/game-constraints'
import { Area, AreaType } from '@/lib/game/area'
import { createBackgroundGraphics } from '@/lib/game/background'
import { Entity } from '@/lib/game/entity'
import { ActionType } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { useSettings } from '@/providers/Settings'
import { Effect } from 'effect'
import { useLocale, useTranslations } from 'next-intl'
import { Application, Renderer, TickerCallback } from 'pixi.js'
import { useEffect, useRef, useState } from 'react'

export interface GameManager {
  app: Application<Renderer>
  t: any
  locale: string
  addEntity(item: Item, x: number, y: number, isInFridge: boolean): void
  destroyEntity(entity: Entity): void
  stockFridge(): void
  getNextEntityIndex(): number
  onEntityHold(entity: Entity | null): void
  onEntityDrag(entity: Entity | null): void
  onEntityDrop(entity: Entity): void
}

export default function useGameManager(
  app: Application<Renderer>,
  fridge: Item[],
  onItemCreate: (item: Item) => void
) {
  const locale = useLocale()
  const t = useTranslations()
  const settings = useSettings()

  const [holdingEntity, setHoldingEntity] = useState<Entity | null>(null)

  const entityIndexRef = useRef<number>(0)
  const entitiesRef = useRef<Entity[]>([])

  const areasRef = useRef<Area[]>([])

  const tickMsRef = useRef<any>(0)

  useEffect(() => {
    if (!app) return

    initializeGame()
  }, [app])

  useEffect(() => {
    clearFridge()
    stockFridge()
  }, [fridge])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    highlightAreaByType(getHighlightAreaTypes(holdingEntity))
    highlightEntities(getHighlightEntities(holdingEntity))

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [holdingEntity])

  const initializeGame = () => {
    app.stage.eventMode = 'static'
    app.stage.hitArea = app.screen

    app.stage.removeChildren()
    app.renderer.render(app.stage)

    app.ticker.add(handleMicroTick)

    renderBackground()
    renderArea()
    stockFridge()
  }

  const renderBackground = () => {
    const graphics = createBackgroundGraphics(gameManager)
    app.stage.addChild(...graphics)
  }

  const renderArea = () => {
    const types = [
      AreaType.Sink,
      AreaType.Knife,
      AreaType.Pan,
      AreaType.Grill,
      AreaType.Fry,
      AreaType.Pot1,
      AreaType.Pot2,
    ]
    for (const type of types) {
      const area = new Area(gameManager, type)
      areasRef.current.push(area)
      area.render()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyF') {
      handleKnifeChop()
    }

    if (e.code === 'KeyV') {
      handleImpact()
    }
  }

  const handleAddEntity = (item: Item, x: number, y: number, isInFridge: boolean) => {
    const entity = new Entity(gameManager, item, x, y, isInFridge)
    entitiesRef.current.push(entity)
    entity.render()
    onItemCreate(item)
  }

  const handleDestroyEntity = (entity: Entity) => {
    entitiesRef.current = entitiesRef.current.filter((e) => e !== entity)
    setHoldingEntity((prev) => {
      if (prev === entity) {
        return null
      }

      return prev
    })

    entity.destroy()
  }

  const handleMicroTick: TickerCallback<any> = (e) => {
    tickMsRef.current += e.deltaMS

    const tickLength = GameConstraints.Tick.Length / GameConstraints.Tick.Speed

    if (tickMsRef.current > tickLength) {
      tickMsRef.current = tickMsRef.current % tickLength
      handleTick()
    }
  }

  const handleTick = () => {
    for (const entity of entitiesRef.current) {
      entity.nextTick(settings.data.cookSpeed)
    }
  }

  const clearFridge = () => {
    for (const entity of entitiesRef.current) {
      if (entity.isInFridge) {
        gameManager.destroyEntity(entity)
      }
    }
  }

  const stockFridge = () => {
    let fridgeIndex: number = -1
    fridgeLoop: for (const fridgeItem of fridge) {
      fridgeIndex++

      for (const entity of entitiesRef.current) {
        if (entity.isInFridge && entity.item.id === fridgeItem.id) continue fridgeLoop
      }

      const px = fridgeIndex % 3
      const py = Math.ceil((fridgeIndex + 1) / 3)

      const x =
        GameConstraints.Fridge.getX(app.screen.width) +
        GameConstraints.Fridge.PaddingX +
        (GameConstraints.Entity.Width + GameConstraints.Fridge.GapX) * px +
        GameConstraints.Entity.Radius

      const y =
        GameConstraints.Fridge.getY() +
        GameConstraints.Fridge.PaddingY +
        (GameConstraints.Entity.Height + GameConstraints.Fridge.GapY) * (py - 1) +
        GameConstraints.Entity.Radius

      gameManager.addEntity(fridgeItem, x, y, true)
    }
  }

  const getCollisionArea = (entity: Entity) => {
    for (const area of areasRef.current) {
      const intersects = area.getBounds().rectangle.intersects(entity.getBounds().rectangle)
      if (intersects) {
        return area
      }
    }
  }

  const getCollisionEntities = (targetEntity: Entity) => {
    const result: [Entity, number][] = []

    for (const entity of entitiesRef.current) {
      if (entity === targetEntity) continue
      if (entity.isInFridge) continue

      const distance = Math.sqrt(
        Math.pow(entity.x - targetEntity.x, 2) + Math.pow(entity.y - targetEntity.y, 2)
      )

      if (distance < GameConstraints.Entity.Radius * 2) {
        result.push([entity, distance])
      }
    }

    result.sort((a, b) => a[1] - b[1])

    const entities = result.map((value) => value[0])
    return entities
  }

  const highlightEntities = (candidates: Entity[]) => {
    for (const entity of entitiesRef.current) {
      const highlight = candidates.includes(entity)
      entity.setHighlight(highlight)
    }
  }

  const getHighlightEntities = (targetEntity: Entity | null) => {
    if (!targetEntity) return []

    const item = targetEntity.item
    const actions = recipe.getActionsByItemAndActionType(item, ActionType.Mix).pipe(Effect.runSync)
    if (!actions.length) return []

    const inputs = actions.map((action) => action.input)
    const itemsIds: number[] = []
    for (const input of inputs) {
      if (input[0].id === input[1].id) {
        itemsIds.push(input[1].id)
        continue
      }

      const companyItem = input.find((value) => value.id !== item.id)
      if (companyItem) {
        itemsIds.push(companyItem.id)
      }
    }

    const entities: Entity[] = []
    for (const entity of entitiesRef.current) {
      if (entity.isInFridge) continue
      if (entity === targetEntity) continue

      const highlight = itemsIds.includes(entity.item.id)
      if (highlight) entities.push(entity)
    }

    return entities
  }

  const highlightAreaByType = (types: AreaType[]) => {
    for (const area of areasRef.current) {
      if (types.includes(area.type)) {
        area.setStrokeColor(GameConstraints.Area.HighlightedStrokeColor)
      } else {
        area.setStrokeColor(GameConstraints.Area.StrokeColor)
      }
    }
  }

  const getHighlightAreaTypes = (entity: Entity | null) => {
    if (!entity) return []

    const item = entity.item
    const actions = recipe.getActionsByItem(item).pipe(Effect.runSync)

    const types: AreaType[] = [AreaType.Sink]
    for (const action of actions) {
      if (action.type === ActionType.Grill) types.push(AreaType.Grill)
      if (action.type === ActionType.Pan) types.push(AreaType.Pan)
      if (action.type === ActionType.Fry) types.push(AreaType.Fry)
      if (action.type === ActionType.Cut) types.push(AreaType.Knife)
      if (action.type === ActionType.Pot) {
        types.push(AreaType.Pot1)
        types.push(AreaType.Pot2)
      }
    }

    return types
  }

  const highlightHoveringAreaByEntity = (entity: Entity | null) => {
    if (!entity) {
      for (const area of areasRef.current) {
        area.setBackground(GameConstraints.Area.BackgroundColor)
      }

      return
    }

    const hoveringArea = getCollisionArea(entity)
    const availableAreaTypes = getHighlightAreaTypes(entity)
    for (const area of areasRef.current) {
      if (
        hoveringArea &&
        area.type === hoveringArea.type &&
        availableAreaTypes.includes(area.type)
      ) {
        area.setBackground(GameConstraints.Area.HoveringBackgroundColor)
      } else {
        area.setBackground(GameConstraints.Area.BackgroundColor)
      }
    }
  }

  const highlightHoveringEntity = (targetEntity: Entity | null) => {
    if (!targetEntity) {
      for (const entity of entitiesRef.current) {
        entity.setHover(false)
      }

      return
    }

    const entities = getCollisionEntities(targetEntity)
    const highlightedEntities = getHighlightEntities(targetEntity)

    for (const entity of entitiesRef.current) {
      if (entities.includes(entity) && highlightedEntities.includes(entity)) {
        entity.setHover(true)
      } else {
        entity.setHover(false)
      }
    }
  }

  const getPotStatus = () => {
    const status: [boolean, boolean] = [false, false]

    for (const entity of entitiesRef.current) {
      if (entity.potIndex !== null) {
        status[entity.potIndex] = true
      }
    }

    return status
  }

  const performActionByEntity = (entity: Entity, isDragging: boolean) => {
    const area = getCollisionArea(entity)
    if (!area) {
      entity.setAction(null)
      return true
    }

    if (isDragging) return true

    if (area.type === AreaType.Sink) {
      gameManager.destroyEntity(entity)
      return false
    }

    if (area.type === AreaType.Grill) {
      const action = recipe
        .getActionsByItemAndActionType(entity.item, ActionType.Grill)
        .pipe(Effect.runSync)[0]
      if (!action) return true

      entity.setAction(action)
    }

    if (area.type === AreaType.Pan) {
      const action = recipe
        .getActionsByItemAndActionType(entity.item, ActionType.Pan)
        .pipe(Effect.runSync)[0]
      if (!action) return true

      entity.setAction(action)
    }

    if (area.type === AreaType.Fry) {
      const action = recipe
        .getActionsByItemAndActionType(entity.item, ActionType.Fry)
        .pipe(Effect.runSync)[0]
      if (!action) return true

      entity.setAction(action)
    }

    if (area.type === AreaType.Pot1 || area.type === AreaType.Pot2) {
      const action = recipe
        .getActionsByItemAndActionType(entity.item, ActionType.Pot)
        .pipe(Effect.runSync)[0]
      if (!action) return true

      const potStatus = getPotStatus()
      if (area.type === AreaType.Pot1 && potStatus[0]) return true
      if (area.type === AreaType.Pot2 && potStatus[1]) return true

      entity.setAction(action, area.type === AreaType.Pot1 ? 0 : 1)

      const bounds = area.getBounds()
      const x = bounds.x + bounds.width / 2
      const y = bounds.y + bounds.height / 2
      entity.x = x
      entity.y = y
    }

    return true
  }

  const performMixActionByEntity = (targetEntity: Entity) => {
    const entities = getCollisionEntities(targetEntity)
    const highlightedEntities = getHighlightEntities(targetEntity)

    for (const companyEntity of entities) {
      if (!highlightedEntities.includes(companyEntity)) continue

      const actions = recipe
        .getActionsByItemAndActionType(companyEntity.item, ActionType.Mix)
        .pipe(Effect.runSync)
      const action = actions.find(
        (action) =>
          action.input.includes(targetEntity.item) && action.input.includes(companyEntity.item)
      )

      if (!action) continue
      const output = action.output
      const newItem = output[0]

      const x = (targetEntity.x + companyEntity.x) / 2
      const y = (targetEntity.y + companyEntity.y) / 2

      gameManager.addEntity(newItem, x, y, false)

      gameManager.destroyEntity(targetEntity)
      gameManager.destroyEntity(companyEntity)

      break
    }
  }

  const handleKnifeChop = () => {
    const targetEntities: Entity[] = []

    for (const entity of entitiesRef.current) {
      if (entity.isDragging) continue

      const area = getCollisionArea(entity)
      if (area && area.type === AreaType.Knife) {
        const action = recipe
          .getActionsByItemAndActionType(entity.item, ActionType.Cut)
          .pipe(Effect.runSync)[0]
        if (!action) continue

        entity.setAction(action)
        targetEntities.push(entity)
      }
    }

    for (const entity of targetEntities) {
      entity.nextChop()
    }
  }

  const handleImpact = () => {
    if (holdingEntity === null) return

    const action = recipe
      .getActionsByItemAndActionType(holdingEntity.item, ActionType.Impact)
      .pipe(Effect.runSync)[0]
    if (!action) return

    holdingEntity.impact()
  }

  const handleNextEntityIndex = () => {
    const index = entityIndexRef.current
    entityIndexRef.current++
    return index
  }

  const handleEntityHold = (entity: Entity | null) => {
    setHoldingEntity(entity)
  }

  const handleEntityDrag = (entity: Entity | null) => {
    highlightHoveringAreaByEntity(entity)
    highlightHoveringEntity(entity)
    entity && performActionByEntity(entity, true)
  }

  const handleEntityDrop = (entity: Entity) => {
    gameManager.onEntityHold(null)
    gameManager.onEntityDrag(null)
    const pass = performActionByEntity(entity, false)
    pass && performMixActionByEntity(entity)
  }

  const gameManager: GameManager = {
    app,
    t,
    locale,
    addEntity: handleAddEntity,
    destroyEntity: handleDestroyEntity,
    stockFridge: stockFridge,
    getNextEntityIndex: handleNextEntityIndex,
    onEntityHold: handleEntityHold,
    onEntityDrag: handleEntityDrag,
    onEntityDrop: handleEntityDrop,
  }

  return gameManager
}
