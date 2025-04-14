import GameConstraints from '@/lib/game-constraints'
import { GameManager } from '@/lib/game/game-manager'
import { Container, Graphics, GraphicsContext } from 'pixi.js'

export enum AreaType {
  Sink,
  Knife,
  Pot1,
  Pot2,
  Pan,
  Grill,
  Fry,
}

export class Area extends Container {
  private context!: GraphicsContext
  private stroke = GameConstraints.Area.StrokeColor
  private background = GameConstraints.Area.BackgroundColor

  constructor(
    public gameManager: GameManager,
    public type: AreaType
  ) {
    super()
    this.initialize()
  }

  private initialize() {
    const graphics = this.createGraphics()
    this.addChild(graphics)
  }

  private createGraphics() {
    const { app } = this.gameManager

    const screenWidth = app.screen.width
    const screenHeight = app.screen.height

    if (this.type !== AreaType.Pot1 && this.type !== AreaType.Pot2) {
      let Constraints
      switch (this.type) {
        case AreaType.Sink:
          Constraints = GameConstraints.Sink
          break
        case AreaType.Knife:
          Constraints = GameConstraints.Knife
          break
        case AreaType.Pan:
          Constraints = GameConstraints.Pan
          break
        case AreaType.Fry:
          Constraints = GameConstraints.Fryer
          break
        case AreaType.Grill:
          Constraints = GameConstraints.Grill
          break
      }

      const graphics = new Graphics()
        .roundRect(
          Constraints.getX(screenWidth) + Constraints.PaddingX,
          Constraints.getY(screenHeight) + Constraints.PaddingY,
          Constraints.getWidth() - Constraints.PaddingX * 2,
          Constraints.getHeight() - Constraints.PaddingY * 2,
          GameConstraints.Area.Rounded
        )
        .fill(this.background)
        .stroke({
          color: this.stroke,
          width: 2,
        })

      return graphics
    } else {
      if (this.type === AreaType.Pot1) {
        const graphics = new Graphics()
          .circle(
            GameConstraints.Pot.getX(screenWidth) +
              GameConstraints.Pot.PaddingX +
              GameConstraints.Entity.Radius,
            GameConstraints.Pot.getY() +
              GameConstraints.Pot.PaddingY +
              GameConstraints.Entity.Radius,
            GameConstraints.Entity.Radius
          )
          .fill(this.background)
          .stroke({
            color: this.stroke,
            width: 2,
          })

        return graphics
      } else {
        const graphics = new Graphics()
          .circle(
            GameConstraints.Pot.getX(screenWidth) +
              GameConstraints.Pot.PaddingX +
              GameConstraints.Pot.Gap +
              GameConstraints.Entity.Radius * 3,
            GameConstraints.Pot.getY() +
              GameConstraints.Pot.PaddingY +
              GameConstraints.Entity.Radius,
            GameConstraints.Entity.Radius
          )
          .fill(this.background)
          .stroke({
            color: this.stroke,
            width: 2,
          })

        return graphics
      }
    }
  }

  public setStrokeColor(color: number) {
    this.stroke = color
    this.update()
  }

  public setBackground(color: number) {
    this.background = color
    this.update()
  }

  private update() {
    this.removeChildren()
    const graphics = this.createGraphics()
    this.addChild(graphics)
  }

  render() {
    this.gameManager.app.stage.addChild(this)
  }
}
