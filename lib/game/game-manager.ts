import GameConstraints from '@/lib/game-constraints'
import { createBackgroundGraphics } from '@/lib/game/background'
import { Entity } from '@/lib/game/entity'
import { Item } from '@/lib/restaurant/item'
import { useLocale, useTranslations } from 'next-intl'
import { Application, Renderer } from 'pixi.js'
import { useEffect, useRef } from 'react'

export interface GameManager {
  app: Application<Renderer>
  t: any
  locale: string
  addEntity(item: Item, x: number, y: number, isInFridge: boolean): void
  destroyEntity(entity: Entity): void
  stockFridge(): void
  getNextEntityIndex(): number
}

export default function useGameManager(app: Application<Renderer>, fridge: Item[]) {
  const locale = useLocale()
  const t = useTranslations()
  const entityIndexRef = useRef<number>(0)
  const entitiesRef = useRef<Entity[]>([])

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    clearFridge()
    stockFridge()
  }, [fridge])

  const initializeGame = () => {
    app.stage.eventMode = 'static'
    app.stage.hitArea = app.screen
    app.stage.removeChildren()
    app.renderer.render(app.stage)
    renderBackground()
    stockFridge()
  }

  const renderBackground = () => {
    const graphics = createBackgroundGraphics(gameManager)
    app.stage.addChild(...graphics)
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

  const handleNextEntityIndex = () => {
    const index = entityIndexRef.current
    entityIndexRef.current++
    return index
  }

  const gameManager: GameManager = {
    app,
    t,
    locale,
    addEntity: handleAddEntity,
    destroyEntity: handleDestroyEntity,
    stockFridge: stockFridge,
    getNextEntityIndex: handleNextEntityIndex,
  }

  return gameManager
}
