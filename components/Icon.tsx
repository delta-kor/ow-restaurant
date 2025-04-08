import BookSvg from '@/public/icons/book.svg'
import GameSvg from '@/public/icons/game.svg'
import SettingsSvg from '@/public/icons/settings.svg'

const Icon = {
  Book: BookSvg,
  Game: GameSvg,
  Settings: SettingsSvg,
}

export type IconType = (typeof Icon)[keyof typeof Icon]

export default Icon
