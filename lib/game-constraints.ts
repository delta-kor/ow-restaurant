namespace GameConstraints {
  export const Entity = {
    Width: 52,
    Height: 52,
  }
  export const View = {
    PaddingTop: 16,
    PaddingRight: 16,
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
  }
  export const Color = {
    PrimaryBackground: 0xeff3ff,
    PrimaryLight: 0xadc3ff,
  }
}

export default GameConstraints
