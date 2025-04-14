import GameConstraints from '@/lib/game-constraints'
import { GameManager } from '@/lib/game/game-manager'
import { ContainerChild, Graphics, Text, TextStyle, TextStyleFontWeight } from 'pixi.js'

export function createBackgroundGraphics(gameManager: GameManager) {
  const { app, t } = gameManager
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
    text: t('fridge'),
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
    text: t('pot'),
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
    text: t('pan'),
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
    text: t('grill'),
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Grill.getLabelX(screenWidth),
    y: GameConstraints.Grill.getLabelY(),
  })

  graphics.push(grill, grillText)

  // Render sink
  const sink = new Graphics()
    .roundRect(
      GameConstraints.Sink.getX(screenWidth),
      GameConstraints.Sink.getY(screenHeight),
      GameConstraints.Sink.getWidth(),
      GameConstraints.Sink.getHeight(),
      GameConstraints.Sink.Rounded
    )
    .fill(GameConstraints.Machine.BackgroundColor)

  const sinkText = new Text({
    text: t('sink'),
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Sink.getLabelX(screenWidth),
    y: GameConstraints.Sink.getLabelY(screenHeight),
  })

  graphics.push(sink, sinkText)

  // Render knife
  const knife = new Graphics()
    .roundRect(
      GameConstraints.Knife.getX(screenWidth),
      GameConstraints.Knife.getY(screenHeight),
      GameConstraints.Knife.getWidth(),
      GameConstraints.Knife.getHeight(),
      GameConstraints.Knife.Rounded
    )
    .fill(GameConstraints.Machine.BackgroundColor)

  const knifeText = new Text({
    text: t('cuttingBoard'),
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Knife.getLabelX(screenWidth),
    y: GameConstraints.Knife.getLabelY(screenHeight),
  })

  graphics.push(knife, knifeText)

  // Render fryer
  const fryer = new Graphics()
    .roundRect(
      GameConstraints.Fryer.getX(screenWidth),
      GameConstraints.Fryer.getY(screenHeight),
      GameConstraints.Fryer.getWidth(),
      GameConstraints.Fryer.getHeight(),
      GameConstraints.Fryer.Rounded
    )
    .fill(GameConstraints.Machine.BackgroundColor)

  const fryerText = new Text({
    text: t('fry'),
    style: labelFont,
    anchor: { x: 1, y: 0 },
    x: GameConstraints.Fryer.getLabelX(screenWidth),
    y: GameConstraints.Fryer.getLabelY(screenHeight),
  })

  graphics.push(fryer, fryerText)

  return graphics
}
