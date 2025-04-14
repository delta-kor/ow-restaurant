import GameConstraints from '@/lib/game-constraints'
import { GameManager } from '@/lib/game/game-manager'
import { Item } from '@/lib/restaurant/item'
import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Text,
  TextStyle,
  TextStyleFontWeight,
} from 'pixi.js'

export class Entity extends Container {
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
      this.x = e.screenX
      this.y = e.screenY
      this.gameManager.onEntityDrag(this)
    }

    const onDragStart = () => {
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
      app.stage.off('pointermove', onDragMove)
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

    this.x = x
    this.y = y
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
    })
  }

  public render() {
    const { app } = this.gameManager
    app.stage.addChild(this)
  }
}
