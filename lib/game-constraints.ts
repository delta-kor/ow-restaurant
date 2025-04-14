namespace GameConstraints {
  export const Color = {
    PrimaryBackground: 0xeff3ff,
    PrimaryLight: 0xadc3ff,
  }

  export const Entity = {
    Width: 52,
    Height: 52,
  }

  export const Machine = {
    BackgroundColor: Color.PrimaryBackground,
  }

  export const View = {
    PaddingTop: 16,
    PaddingRight: 16,
    MachineGap: 16,
  }

  export const Fridge = {
    GapX: 16,
    GapY: 16,
    PaddingX: 16,
    PaddingY: 16,
    Rounded: 8,
    getWidth: () => Fridge.PaddingX * 2 + Fridge.GapX * 2 + Entity.Width * 3,
    getHeight: () => Fridge.PaddingY * 2 + Fridge.GapY + Entity.Height * 2,
    getX: (screenWidth: number) => screenWidth - View.PaddingRight - Fridge.getWidth(),
    getY: () => View.PaddingTop,
    LabelMargin: 4,
    getLabelX: (screenWidth: number) => Fridge.getX(screenWidth) + Fridge.getWidth(),
    getLabelY: () => Fridge.getY() + Fridge.getHeight() + Fridge.LabelMargin,
  }

  export const Pot = {
    Gap: 16,
    PaddingX: 16,
    PaddingY: 16,
    Rounded: 8,
    getWidth: () => Pot.PaddingX * 2 + Pot.Gap + Entity.Width * 2,
    getHeight: () => Pot.PaddingY * 2 + Entity.Height,
    getX: (screenWidth: number) =>
      screenWidth - View.PaddingRight - Fridge.getWidth() - View.MachineGap - Pot.getWidth(),
    getY: () => View.PaddingTop,
    LabelMargin: 4,
    getLabelX: (screenWidth: number) => Pot.getX(screenWidth) + Pot.getWidth(),
    getLabelY: () => View.PaddingTop + Pot.getHeight() + Pot.LabelMargin,
  }

  export const Pan = {
    PaddingX: 8,
    PaddingY: 8,
    AreaWidth: 116,
    AreaHeight: 68,
    Rounded: 8,
    getWidth: () => Pan.PaddingX * 2 + Pan.AreaWidth,
    getHeight: () => Pan.PaddingY * 2 + Pan.AreaHeight,
    getX: (screenWidth: number) =>
      screenWidth -
      View.PaddingRight -
      Fridge.getWidth() -
      Pot.getWidth() -
      View.MachineGap * 2 -
      Pan.getWidth(),
    getY: () => View.PaddingTop,
    LabelMargin: 4,
    getLabelX: (screenWidth: number) => Pan.getX(screenWidth) + Pan.getWidth(),
    getLabelY: () => View.PaddingTop + Pan.getHeight() + Pan.LabelMargin,
  }

  export const Grill = {
    PaddingX: 8,
    PaddingY: 8,
    AreaWidth: 172,
    AreaHeight: 68,
    Rounded: 8,
    getWidth: () => Grill.PaddingX * 2 + Grill.AreaWidth,
    getHeight: () => Grill.PaddingY * 2 + Grill.AreaHeight,
    getX: (screenWidth: number) =>
      screenWidth -
      View.PaddingRight -
      Fridge.getWidth() -
      Pot.getWidth() -
      Pan.getWidth() -
      View.MachineGap * 3 -
      Grill.getWidth(),
    getY: () => View.PaddingTop,
    LabelMargin: 4,
    getLabelX: (screenWidth: number) => Grill.getX(screenWidth) + Grill.getWidth(),
    getLabelY: () => View.PaddingTop + Grill.getHeight() + Grill.LabelMargin,
  }

  export const Sink = {
    PaddingX: 8,
    PaddingY: 8,
    AreaWidth: 76,
    AreaHeight: 124,
    Rounded: 8,
    getWidth: () => Sink.PaddingX * 2 + Sink.AreaWidth,
    getHeight: () => Sink.PaddingY * 2 + Sink.AreaHeight,
    getX: (screenWidth: number) => screenWidth - View.PaddingRight - Sink.getWidth(),
    getY: (screenHeight: number) => screenHeight / 2,
    LabelMargin: 4,
    getLabelX: (screenWidth: number) => Sink.getX(screenWidth) + Sink.getWidth(),
    getLabelY: (screenHeight: number) =>
      Sink.getY(screenHeight) + Sink.getHeight() + Sink.LabelMargin,
  }

  export const Knife = {
    PaddingX: 8,
    PaddingY: 8,
    AreaWidth: 76,
    AreaHeight: 178,
    Rounded: 8,
    getWidth: () => Knife.PaddingX * 2 + Knife.AreaWidth,
    getHeight: () => Knife.PaddingY * 2 + Knife.AreaHeight,
    getX: (screenWidth: number) =>
      screenWidth -
      View.PaddingRight -
      Sink.getWidth() * 2 -
      View.MachineGap * 2 -
      Knife.getWidth(),
    getY: (screenHeight: number) => screenHeight / 2,
    LabelMargin: 4,
    getLabelX: (screenWidth: number) => Knife.getX(screenWidth) + Knife.getWidth(),
    getLabelY: (screenHeight: number) =>
      Knife.getY(screenHeight) + Knife.getHeight() + Knife.LabelMargin,
  }

  export const Fryer = {
    PaddingX: 8,
    PaddingY: 8,
    AreaWidth: 116,
    AreaHeight: 68,
    Rounded: 8,
    getWidth: () => Fryer.PaddingX * 2 + Fryer.AreaWidth,
    getHeight: () => Fryer.PaddingY * 2 + Fryer.AreaHeight,
    getX: (screenWidth: number) =>
      screenWidth -
      View.PaddingRight -
      Sink.getWidth() * 3 -
      Knife.getWidth() -
      View.MachineGap * 4 -
      Fryer.getWidth(),
    getY: (screenHeight: number) => screenHeight / 2,
    LabelMargin: 4,
    getLabelX: (screenWidth: number) => Fryer.getX(screenWidth) + Fryer.getWidth(),
    getLabelY: (screenHeight: number) =>
      Fryer.getY(screenHeight) + Fryer.getHeight() + Fryer.LabelMargin,
  }

  export const Label = {
    FontSize: '12px',
    FontWeight: '600',
    TextColor: Color.PrimaryLight,
  }
}

export default GameConstraints
