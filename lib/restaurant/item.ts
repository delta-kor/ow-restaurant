export interface ItemConfig {
  id: number
  koreanName: string
  englishName: string
  japaneseName: string
  canMelt: boolean
  colorCode: string
}

export class Item {
  public readonly id: number
  private readonly koreanName: string
  private readonly englishName: string
  private readonly japaneseName: string
  private readonly canMelt: boolean
  public readonly colorCode: string

  constructor(config: ItemConfig) {
    this.id = config.id
    this.koreanName = config.koreanName
    this.englishName = config.englishName
    this.japaneseName = config.japaneseName
    this.canMelt = config.canMelt
    this.colorCode = config.colorCode
  }

  public getName(locale: string) {
    switch (locale) {
      case 'ko':
        return this.koreanName
      case 'en':
        return this.englishName
      case 'ja':
        return this.japaneseName
      default:
        return this.koreanName
    }
  }

  public toJSON() {
    return {
      id: this.id,
      name: [this.koreanName, this.englishName, this.japaneseName],
      canMelt: this.canMelt,
      colorCode: this.colorCode,
    }
  }
}
