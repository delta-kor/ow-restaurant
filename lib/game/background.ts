import GameConstraints from '@/lib/game-constraints'
import {
  Application,
  ContainerChild,
  Graphics,
  Renderer,
  Text,
  TextStyle,
  TextStyleFontWeight,
} from 'pixi.js'

export default function createBackgroundGraphics(app: Application<Renderer>) {
  const graphics: ContainerChild[] = []

  const screenWidth = app.screen.width
  const screenHeight = app.screen.height

  const labelFont = new TextStyle({
    fontFamily: 'Wanted Sans Variable',
    fontWeight: GameConstraints.Label.FontWeight as TextStyleFontWeight,
    fontSize: GameConstraints.Label.FontSize,
    fill: GameConstraints.Label.TextColor,
  })

  // Render fridge
  const fridge = new Graphics()
    .roundRect(
      GameConstraints.Fridge.getX(screenWidth),
      GameConstraints.Fridge.getY(),
      GameConstraints.Fridge.getWidth(),
      GameConstraints.Fridge.getHeight(),
      GameConstraints.Fridge.Rounded
    )
    .fill(GameConstraints.Machine.BackgroundColor)

  const fridgeText = new Text({
    text: '냉장고',
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Fridge.getLabelX(screenWidth),
    y: GameConstraints.Fridge.getLabelY(),
  })

  graphics.push(fridge, fridgeText)

  // Render pot
  const pot = new Graphics()
    .roundRect(
      GameConstraints.Pot.getX(screenWidth),
      GameConstraints.Pot.getY(),
      GameConstraints.Pot.getWidth(),
      GameConstraints.Pot.getHeight(),
      GameConstraints.Pot.Rounded
    )
    .fill(GameConstraints.Machine.BackgroundColor)

  const potText = new Text({
    text: '솥',
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Pot.getLabelX(screenWidth),
    y: GameConstraints.Pot.getLabelY(),
  })

  graphics.push(pot, potText)

  // Render pan
  const pan = new Graphics()
    .roundRect(
      GameConstraints.Pan.getX(screenWidth),
      GameConstraints.Pan.getY(),
      GameConstraints.Pan.getWidth(),
      GameConstraints.Pan.getHeight(),
      GameConstraints.Pan.Rounded
    )
    .fill(GameConstraints.Machine.BackgroundColor)

  const panText = new Text({
    text: '팬',
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Pan.getLabelX(screenWidth),
    y: GameConstraints.Pan.getLabelY(),
  })

  graphics.push(pan, panText)

  // Render grill
  const grill = new Graphics()
    .roundRect(
      GameConstraints.Grill.getX(screenWidth),
      GameConstraints.Grill.getY(),
      GameConstraints.Grill.getWidth(),
      GameConstraints.Grill.getHeight(),
      GameConstraints.Grill.Rounded
    )
    .fill(GameConstraints.Machine.BackgroundColor)

  const grillText = new Text({
    text: '그릴',
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Grill.getLabelX(screenWidth),
    y: GameConstraints.Grill.getLabelY(),
  })

  graphics.push(grill, grillText)

  return graphics
}
