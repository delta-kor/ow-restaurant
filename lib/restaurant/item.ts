export interface ItemConfig {
  id: number
  koreanName: string
  englishName: string
  japaneseName: string
}

export class Item {
  public readonly id: number
  private readonly koreanName: string
  private readonly englishName: string
  private readonly japaneseName: string

  constructor(config: ItemConfig) {
    this.id = config.id
    this.koreanName = config.koreanName
    this.englishName = config.englishName
    this.japaneseName = config.japaneseName
  }
}
