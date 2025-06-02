import { ItemJson } from '@/lib/restaurant/recipe'

export interface ItemConfig {
  id: number
  koreanName: string
  englishName: string
  japaneseName: string
  chineseName: string
  canMelt: boolean
  colorCode: string
}

export class Item {
  public readonly id: number
  private readonly koreanName: string
  private readonly englishName: string
  private readonly japaneseName: string
  private readonly chineseName: string
  private readonly canMelt: boolean
  public readonly colorCode: string
  private readonly additionalItems: Item[] = []

  constructor(config: ItemConfig) {
    this.id = config.id
    this.koreanName = config.koreanName
    this.englishName = config.englishName
    this.japaneseName = config.japaneseName
    this.chineseName = config.chineseName
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
      case 'zh-CN':
        return this.chineseName
      default:
        return this.koreanName
    }
  }

  public addAdditionalItem(item: Item) {
    this.additionalItems.push(item)
  }

  public getAdditionalItems() {
    return this.additionalItems
  }

  public toJSON(): ItemJson {
    return {
      id: this.id,
      name: [this.koreanName, this.englishName, this.japaneseName, this.chineseName],
      canMelt: this.canMelt,
      colorCode: this.colorCode,
      additionalItems: this.additionalItems.map((item) => item.id),
    }
  }
}
