import { Item } from '@/lib/restaurant/item'
import { StageJson } from '@/lib/restaurant/recipe'

export class Stage {
  public static create(json: StageJson, items: Item[]) {
    const fridge = json.fridge.map((id) => items.find((item) => item.id === id)!)
    const menus = json.menus.map((id) => items.find((item) => item.id === id)!)
    const hazardMenus = json.hazardMenus.map((id) => items.find((item) => item.id === id)!)

    const id = json.id
    const koreanName = json.name[0]
    const englishName = json.name[1]
    const japaneseName = json.name[2]

    return new Stage(id, koreanName, englishName, japaneseName, fridge, menus, hazardMenus)
  }

  private constructor(
    public readonly id: number,
    private readonly koreanName: string,
    private readonly englishName: string,
    private readonly japaneseName: string,
    public readonly fridge: Item[],
    public readonly menus: Item[],
    public readonly hazardMenus: Item[]
  ) {}

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
}
