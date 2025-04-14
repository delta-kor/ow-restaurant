import GameConstraints from '@/lib/game-constraints'
import { GameManager } from '@/lib/game/game-manager'
import { Action, ActionType } from '@/lib/restaurant/action'
import { Item } from '@/lib/restaurant/item'
import { recipe } from '@/lib/restaurant/restaurant'
import { Effect } from 'effect'
import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Text,
  TextStyle,
  TextStyleFontWeight,
} from 'pixi.js'

export class Entity extends Container {
  private action: Action | null = null
  private preservedAction: Action | null = null
  private actionProgress: number = 0
  public isDragging: boolean = false
  public potIndex: number | null = null

  constructor(
    private gameManager: GameManager,
    public item: Item,
    x: number,
    y: number,
    public isInFridge: boolean = false
  ) {
    super()
    this.initialize(x, y)
  }

  private initialize(x: number, y: number) {
    const { app, locale } = this.gameManager

    const onDragMove = (e: FederatedPointerEvent) => {
      if (!this.isDragging) return
      this.x = e.screenX
      this.y = e.screenY
      this.gameManager.onEntityDrag(this)
    }

    const onDragStart = () => {
      if (this.isDragging) return

      this.isDragging = true
      this.alpha = 0.5
      this.zIndex = this.gameManager.getNextEntityIndex()
      this.gameManager.onEntityHold(this)

      if (this.isInFridge) {
        this.isInFridge = false
        this.gameManager.stockFridge()
      }

      app.stage.on('pointermove', onDragMove)
    }

    const onDragEnd = () => {
      if (!this.isDragging) return

      app.stage.off('pointermove', onDragMove)
      this.isDragging = false
      this.alpha = 1
      this.gameManager.onEntityDrop(this)
    }

    const bubble = new Graphics()
      .circle(0, 0, GameConstraints.Entity.Radius)
      .fill(GameConstraints.Color.Primary)

    const text = new Text({
      text: this.item.getName(locale),
      style: new TextStyle({
        fill: GameConstraints.Color.White,
        fontFamily: 'Wanted Sans Variable',
        fontSize: GameConstraints.Entity.FontSize,
        fontWeight: GameConstraints.Entity.FontWeight as TextStyleFontWeight,
      }),
      anchor: { x: 0.5, y: 0.5 },
      x: 0,
      y: 0,
    })

    bubble.zIndex = 10
    text.zIndex = 20

    this.x = x
    this.y = y
    this.sortableChildren = true

    this.addChild(bubble, text)
    this.eventMode = 'static'
    this.cursor = 'pointer'
    this.on('pointerdown', onDragStart)
    this.zIndex = this.gameManager.getNextEntityIndex()

    app.stage.on('pointerup', onDragEnd)
    app.stage.on('pointerupoutside', onDragEnd)

    this.on('destroyed', () => {
      app.stage.off('pointerup', onDragEnd)
      app.stage.off('pointerupoutside', onDragEnd)
      app.stage.off('pointermove', onDragMove)
    })
  }

  public setHighlight(active: boolean) {
    const existingChild = this.getChildByLabel('highlight')
    if (existingChild) {
      this.removeChild(existingChild)
    }

    if (active) {
      const graphics = new Graphics()
        .circle(0, 0, GameConstraints.Entity.Radius + 5)
        .stroke({ width: 2, color: GameConstraints.Color.PrimaryLight })

      graphics.zIndex = 10
      graphics.label = 'highlight'

      this.addChild(graphics)
    }
  }

  public setHover(active: boolean) {
    if (active) {
      this.alpha = 0.8
    } else {
      this.alpha = this.isDragging ? 0.5 : 1
    }
  }

  private updateProgress() {
    const existingChild = this.getChildByLabel('progress')
    if (existingChild) {
      this.removeChild(existingChild)
    }

    const progress = this.getProgress()
    if (progress === null) return

    if (progress >= 1) {
      return this.onFinish()
    }

    const graphics = new Graphics()
      .arc(0, 0, GameConstraints.Entity.Radius + 5, 0, Math.PI * 2 * progress)
      .stroke({ width: 2, color: GameConstraints.Color.Primary })

    graphics.zIndex = 5
    graphics.label = 'progress'

    this.addChild(graphics)
  }

  private onFinish(overrideOutput?: Item[]) {
    if (!overrideOutput && this.action === null) return

    let x = this.x
    let y = this.y
    if (this.action?.type === ActionType.Pot) {
      x += Math.floor(Math.random() * 40) - 20
      y += 80 + Math.floor(Math.random() * 40) - 20
    }

    const output = overrideOutput || this.action!.output
    if (output.length === 1) {
      this.gameManager.addEntity(output[0], x, y, false)
    }
    if (output.length === 2) {
      this.gameManager.addEntity(output[0], x - 10, y, false)
      this.gameManager.addEntity(output[1], x + 10, y, false)
    }

    this.gameManager.destroyEntity(this)
  }

  public nextTick() {
    if (this.action === null) return
    if (this.action.type === ActionType.Cut) return
    this.actionProgress++
    this.updateProgress()
  }

  public nextChop() {
    if (this.action === null) return
    if (this.action.type !== ActionType.Cut) return
    this.actionProgress += 10
    this.updateProgress()
  }

  public impact() {
    const action = recipe
      .getActionsByItemAndActionType(this.item, ActionType.Impact)
      .pipe(Effect.runSync)[0]
    if (!action) return

    this.onFinish(action.output)
  }

  private getProgress() {
    if (this.action === null) return null

    const effort = this.action.effort
    if (effort === null) return 0

    const effortTick = effort * 10
    const progress = this.actionProgress / effortTick

    return progress
  }

  public setAction(action: Action | null, potIndex: number | null = null) {
    const lastAction = this.action
    if (action?.type === lastAction?.type) return

    if (action === null) {
      this.potIndex = null
      this.action = action
      this.preservedAction = lastAction
      this.updateProgress()
    } else {
      if (action.type === ActionType.Pot && potIndex !== null) {
        this.potIndex = potIndex
      } else {
        this.potIndex = null
      }

      if (this.preservedAction?.type === action.type) {
        this.action = action
        this.updateProgress()
      } else {
        this.actionProgress = 0
        this.action = action
        this.preservedAction = null
        this.updateProgress()
      }
    }
  }

  public render() {
    const { app } = this.gameManager
    app.stage.addChild(this)
  }
}
