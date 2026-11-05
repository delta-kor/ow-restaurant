import terminology from '@/content/info/terms.json'
import labels from '@/content/info/ui.json'

type Terms = { items: Record<string,string>; customers: Record<string,string>; modes: string[]; difficulties: string[]; themes: string[] }
export const infoLocales = ['ko','en','ja','zh-CN','zh-TW'] as const
export function getInfoLocale(locale: string) {
  const lang = infoLocales.includes(locale as typeof infoLocales[number]) ? locale : 'en'
  const terms = (terminology as Record<string,Terms>)[lang]
  const strings = (labels as Record<string,Record<string,string>>)[lang]
  const t = (key: string, values: Record<string,string|number> = {}) => {
    if (!(key in strings)) throw new Error(`Missing Info translation: ${lang}/${key}`)
    return strings[key].replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`))
  }
  const category = (name: string) => t(({'칼':'knives','도구':'tools','이동 장비':'movement','기타':'other'} as Record<string,string>)[name])
  const theme = (name: string) => terms.themes[terminology.ko.themes.indexOf(name)] ?? name
  return {lang,terms,t,category,theme}
}
export function resolveInfoTerms(markdown: string, locale: string) {
  const {terms}=getInfoLocale(locale)
  return markdown.replace(/\{\{([cimdt]):([^}]+)\}\}/g, (_,type,key) => {
    const value = type==='c' ? terms.customers[key] : type==='i' ? terms.items[key] : type==='m' ? terms.modes[Number(key)] : type==='d' ? terms.difficulties[Number(key)] : terms.themes[Number(key)]
    if (!value) throw new Error(`Unknown Info term: ${locale}/${type}:${key}`)
    return value
  })
}
