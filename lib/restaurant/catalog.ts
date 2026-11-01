// v261101: Edition/theme identity is independent of the UI and data language.
export const locales = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW'] as const
export const fallbackLocales = ['en', 'ko', 'ja', 'zh-CN', 'zh-TW'] as const
export type Locale = (typeof locales)[number]
export type ThemeId =
  'default-classic' | 'default-cafe' | 'default-world' | 'joseon-third' | 'joseon-cafe' | 'third'
export const editions = [
  {
    id: 'default',
    butcherShopEnabled: true,
    label: 'default',
    themes: ['default-classic', 'default-cafe', 'default-world'],
  },
  {
    id: 'joseon',
    butcherShopEnabled: false,
    label: 'joseonEdition',
    themes: ['joseon-third', 'joseon-cafe'],
  },
  { id: 'third', butcherShopEnabled: false, label: 'thirdEdition', themes: ['third'] },
] as const
const names: Record<ThemeId, readonly string[]> = {
  'default-classic': ['모듬회밥!', 'OverwatchCooked!', 'クラシック', '什锦料理！', '什錦料理！'],
  'default-cafe': ['카페!', 'Cafe & Dessert', 'カフェ&デザート', '咖啡馆！', '咖啡館！'],
  'default-world': ['쿡제요리', 'World Cuisine', '世界の料理', '世界料理', '世界料理'],
  'joseon-third': ['뉴 3호점', 'Seoul Food', 'ソウルフード', '首尔美食', '首爾美食'],
  'joseon-cafe': [
    '카페&디저트',
    'New Cafe & Dessert',
    '新カフェ&デザート',
    '新咖啡与甜品',
    '新咖啡與甜品',
  ],
  third: ['3호점', 'Seoul Food (old)', 'ソウルフード (old)', '首尔美食 (old)', '首爾美食 (old)'],
}
export function themeName(id: ThemeId, locale: string) {
  return names[id][Math.max(0, locales.indexOf(locale as Locale))]
}
const aliases: Record<string, ThemeId> = {
  cafe: 'default-cafe',
  'cafe-en': 'default-cafe',
  'cafe-zh-CN': 'default-cafe',
  'cook-intl': 'default-world',
  'cook-intl-en': 'default-world',
  'new-third': 'joseon-third',
}
export function resolveTheme(id: string | null): ThemeId | null {
  if (id === null) return 'default-classic'
  if (id in names) return id as ThemeId
  return aliases[id] ?? null
}
export function editionFor(id: ThemeId) {
  return editions.find((e) => (e.themes as readonly string[]).includes(id))!
}
export function bookHref(id: ThemeId, stage = 0) {
  return `/book/${id}/${stage}`
}
export function parseBookPath(path: string[]) {
  if (path.length !== 1 && path.length !== 2) return null
  const theme = resolveTheme(path.length === 1 ? null : path[0])
  const raw = path[path.length - 1]
  if (!theme || !/^\d+$/.test(raw)) return null
  const stage = Number(raw)
  if (!Number.isSafeInteger(stage)) return null
  return { theme, stage }
}
export function selectDataLanguage(available: readonly string[], locale: string): string {
  const language = [locale, ...fallbackLocales].find((l) => available.includes(l))
  if (!language) throw new Error('No recipe dataset available')
  return language
}
