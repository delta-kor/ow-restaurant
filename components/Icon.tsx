import BookSvg from '@/public/icons/book.svg'
import BurgerSvg from '@/public/icons/burger.svg'
import ChickenSvg from '@/public/icons/chicken.svg'
import DumplingSvg from '@/public/icons/dumpling.svg'
import EggSvg from '@/public/icons/egg.svg'
import FishSvg from '@/public/icons/fish.svg'
import GameSvg from '@/public/icons/game.svg'
import IcecreamSvg from '@/public/icons/icecream.svg'
import NoodlesSvg from '@/public/icons/noodles.svg'
import PancakeSvg from '@/public/icons/pancake.svg'
import PizzaSvg from '@/public/icons/pizza.svg'
import SettingsSvg from '@/public/icons/settings.svg'
import SteakSvg from '@/public/icons/steak.svg'
import TacoSvg from '@/public/icons/taco.svg'

const Icon = {
  Book: BookSvg,
  Game: GameSvg,
  Settings: SettingsSvg,
  Burger: BurgerSvg,
  Chicken: ChickenSvg,
  Dumpling: DumplingSvg,
  Egg: EggSvg,
  Fish: FishSvg,
  Icecream: IcecreamSvg,
  Noodles: NoodlesSvg,
  Pancake: PancakeSvg,
  Pizza: PizzaSvg,
  Steak: SteakSvg,
  Taco: TacoSvg,
}

export type IconType = (typeof Icon)[keyof typeof Icon]

export default Icon
