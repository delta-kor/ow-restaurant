import { Item } from '@/lib/restaurant/item'
import { StageJson } from '@/lib/restaurant/recipe'

export class Stage {
  public static create(json: StageJson, items: Item[]) {
    const fridge = json.fridge.map((id) => items.find((item) => item.id === id)!)
    const menus = json.menus.map((id) => items.find((item) => item.id === id)!)
    const hazardMenus = json.hazardMenus.map((id) => items.find((item) => item.id === id)!)

    const koreanName = json.name[0]
    const englishName = json.name[1]
    const japaneseName = json.name[2]

    return new Stage(koreanName, englishName, japaneseName, fridge, menus, hazardMenus)
  }

  private constructor(
    private readonly koreanName: string,
    private readonly englishName: string,
    private readonly japaneseName: string,
    private readonly fridge: Item[],
    private readonly menus: Item[],
    private readonly hazardMenus: Item[]
  ) {}
}
