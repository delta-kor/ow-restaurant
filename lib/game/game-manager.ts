import GameConstraints from '@/lib/game-constraints'
import { Area, AreaType } from '@/lib/game/area'
import { createBackgroundGraphics } from '@/lib/game/background'
import { Entity } from '@/lib/game/entity'
import { ActionType } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { Effect } from 'effect'
import { useLocale, useTranslations } from 'next-intl'
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

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    clearFridge()
    stockFridge()
  }, [fridge])

  useEffect(() => {
    highlightAreaByEntity(holdingEntity)
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

  const highlightAreaByEntity = (entity: Entity | null) => {
    if (!entity) return highlightAreaByType([])

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

    highlightAreaByType(types)
  }

  const highlightHoveringAreaByEntity = (entity: Entity | null) => {
    if (!entity) {
      for (const area of areasRef.current) {
        area.setBackground(GameConstraints.Area.BackgroundColor)
      }

      return
    }

    const hoveringArea = getCollisionArea(entity)
    for (const area of areasRef.current) {
      if (hoveringArea && area.type === hoveringArea.type) {
        area.setBackground(GameConstraints.Area.HoveringBackgroundColor)
      } else {
        area.setBackground(GameConstraints.Area.BackgroundColor)
      }
    }
  }

  const performActionByEntity = (entity: Entity) => {
    const area = getCollisionArea(entity)
    if (!area) return

    if (area.type === AreaType.Sink) {
      entity.destroy()
      return
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
  }

  const handleEntityDrop = (entity: Entity) => {
    gameManager.onEntityHold(null)
    gameManager.onEntityDrag(null)
    performActionByEntity(entity)
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
