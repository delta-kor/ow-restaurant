import { Item } from '@/lib/restaurant/item'

export function getItemColorHex(item: Item): number {
  switch (item.colorCode) {
    case 'D':
      return 0x202020
    case 'R':
      return 0xc83333
    case 'M':
      return 0x904418
    case 'Y':
      return 0xce9731
    case 'W':
      return 0xcccbc8
    case 'L':
      return 0x41ba38
    case 'G':
      return 0x1f681a
    case 'H':
      return 0xe0a73e
    case 'T':
      return 0x397f34
    case 'S':
      return 0x5d2c1f
    case 'C':
      return 0xa63023
    case 'F':
      return 0xd0cfbc
    case 'V':
      return 0x165c11
    case 'O':
      return 0xda7828
    case 'A':
      return 0xe540b1
    case 'P':
      return 0xa05e28
    case 'B':
      return 0x3478b5
    case 'N':
      return 0xeb2f9a
    case 'Q':
      return 0xaa3a79
    case 'X':
      return 0xdb963d
    case 'Z':
      return 0x9f20c3
    case 'U':
      return 0x9f2222
    case 'E':
      return 0x676767
    case 'J':
      return 0x29a86d
    case 'K':
      return 0x78096d
    default:
      return 0x2858dd
  }
}

export function getItemColor(item: Item): string {
  return `#${getItemColorHex(item).toString(16).padStart(6, '0')}`
}

export function getTextColorHex(item: Item): number {
  const hexColor = getItemColor(item)

  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? 0x2c2d31 : 0xffffff
}

export function getItemTextColor(item: Item): string {
  return `#${getTextColorHex(item).toString(16).padStart(6, '0')}`
}
