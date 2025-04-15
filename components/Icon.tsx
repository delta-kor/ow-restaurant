import BookSvg from '@/public/icons/book.svg'
import BurgerSvg from '@/public/icons/burger.svg'
import ChickenSvg from '@/public/icons/chicken.svg'
import CopySvg from '@/public/icons/copy.svg'
import DiscordSvg from '@/public/icons/discord.svg'
import DownChevronSvg from '@/public/icons/down-chevron.svg'
import DumplingSvg from '@/public/icons/dumpling.svg'
import EggSvg from '@/public/icons/egg.svg'
import FishSvg from '@/public/icons/fish.svg'
import FridgeSvg from '@/public/icons/fridge.svg'
import FrySvg from '@/public/icons/fry.svg'
import GameSvg from '@/public/icons/game.svg'
import GithubSvg from '@/public/icons/github.svg'
import GrillSvg from '@/public/icons/grill.svg'
import HomeSvg from '@/public/icons/home.svg'
import IcecreamSvg from '@/public/icons/icecream.svg'
import ImpactSvg from '@/public/icons/impact.svg'
import KnifeSvg from '@/public/icons/knife.svg'
import MixSvg from '@/public/icons/mix.svg'
import NoodlesSvg from '@/public/icons/noodles.svg'
import PanSvg from '@/public/icons/pan.svg'
import PancakeSvg from '@/public/icons/pancake.svg'
import PizzaSvg from '@/public/icons/pizza.svg'
import PotSvg from '@/public/icons/pot.svg'
import RightChevronSvg from '@/public/icons/right-chevron.svg'
import SettingsSvg from '@/public/icons/settings.svg'
import SteakSvg from '@/public/icons/steak.svg'
import TacoSvg from '@/public/icons/taco.svg'
import TimerSvg from '@/public/icons/timer.svg'

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
  RightChevron: RightChevronSvg,
  DownChevron: DownChevronSvg,
  Fridge: FridgeSvg,
  Fry: FrySvg,
  Grill: GrillSvg,
  Knife: KnifeSvg,
  Mix: MixSvg,
  Pan: PanSvg,
  Pot: PotSvg,
  Impact: ImpactSvg,
  Home: HomeSvg,
  Copy: CopySvg,
  Discord: DiscordSvg,
  Timer: TimerSvg,
  Github: GithubSvg,
}

export type IconType = (typeof Icon)[keyof typeof Icon]

export default Icon
