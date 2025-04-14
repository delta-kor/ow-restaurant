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

  export const Label = {
    FontSize: '12px',
    FontWeight: '600',
    TextColor: Color.PrimaryLight,
  }
}

export default GameConstraints
