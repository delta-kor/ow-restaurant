import GameConstraints from '@/lib/game-constraints'
import { Area, AreaType } from '@/lib/game/area'
import { createBackgroundGraphics } from '@/lib/game/background'
import { Entity } from '@/lib/game/entity'
import { ActionType } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { Effect } from 'effect'
import { useLocale, useTranslations } from 'next-intl'
import { clearInterval } from 'node:timers'
import { Application, Renderer } from 'pixi.js'
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

export default function useGameManager(app: Application<Renderer>, fridge: Item[]) {
  const locale = useLocale()
  const t = useTranslations()

  const [holdingEntity, setHoldingEntity] = useState<Entity | null>(null)

  const entityIndexRef = useRef<number>(0)
  const entitiesRef = useRef<Entity[]>([])

  const areasRef = useRef<Area[]>([])

  const intervalRef = useRef<any>(0)

  useEffect(() => {
    if (!app) return

    initializeGame()
    intervalRef.current = setInterval(() => {
      handleTick()
    }, 100)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [app])

  useEffect(() => {
    clearFridge()
    stockFridge()
  }, [fridge])

  useEffect(() => {
    highlightAreaByType(getHighlightAreaTypes(holdingEntity))
  }, [holdingEntity])

  const initializeGame = () => {
    app.stage.eventMode = 'static'
    app.stage.hitArea = app.screen

    app.stage.removeChildren()
    app.renderer.render(app.stage)

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

  const handleAddEntity = (item: Item, x: number, y: number, isInFridge: boolean) => {
    const entity = new Entity(gameManager, item, x, y, isInFridge)
    entitiesRef.current.push(entity)
    entity.render()
  }

  const handleDestroyEntity = (entity: Entity) => {
    entitiesRef.current = entitiesRef.current.filter((e) => e !== entity)
    entity.destroy()
  }

  const handleTick = () => {
    for (const entity of entitiesRef.current) {
      entity.nextTick()
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
      return
    }

    if (isDragging) return

    if (area.type === AreaType.Sink) {
      entity.destroy()
      return
    }

    if (area.type === AreaType.Grill) {
      const action = recipe
        .getActionByItemAndActionType(entity.item, ActionType.Grill)
        .pipe(Effect.runSync)
      if (!action) return

      entity.setAction(action)
    }

    if (area.type === AreaType.Pan) {
      const action = recipe
        .getActionByItemAndActionType(entity.item, ActionType.Pan)
        .pipe(Effect.runSync)
      if (!action) return

      entity.setAction(action)
    }

    if (area.type === AreaType.Fry) {
      const action = recipe
        .getActionByItemAndActionType(entity.item, ActionType.Fry)
        .pipe(Effect.runSync)
      if (!action) return

      entity.setAction(action)
    }

    if (area.type === AreaType.Pot1 || area.type === AreaType.Pot2) {
      const action = recipe
        .getActionByItemAndActionType(entity.item, ActionType.Pot)
        .pipe(Effect.runSync)
      if (!action) return

      const potStatus = getPotStatus()
      if (area.type === AreaType.Pot1 && potStatus[0]) return
      if (area.type === AreaType.Pot2 && potStatus[1]) return

      entity.setAction(action, area.type === AreaType.Pot1 ? 0 : 1)

      const bounds = area.getBounds()
      const x = bounds.x + bounds.width / 2
      const y = bounds.y + bounds.height / 2
      entity.x = x
      entity.y = y
    }
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
    entity && performActionByEntity(entity, true)
  }

  const handleEntityDrop = (entity: Entity) => {
    gameManager.onEntityHold(null)
    gameManager.onEntityDrag(null)
    performActionByEntity(entity, false)
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
