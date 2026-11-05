import MenuItemList from '@/components/MenuItemList'
import { bookHref, parseBookPath } from '@/lib/restaurant/catalog'
import { Item } from '@/lib/restaurant/item'
import { getRecipe } from '@/lib/restaurant/restaurant'
import { FlowLine } from '@/lib/restaurant/solution'
import { Effect } from 'effect'
import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound, redirect } from 'next/navigation'
export interface MenuFlowLineInfo {
  item: Item
  flowLines: FlowLine[]
}
type Params = Promise<{ bookPath: string[]; lang: string }>
function selection(bookPath: string[], lang: string) {
  const selected = parseBookPath(bookPath)
  if (!selected) notFound()
  const recipe = getRecipe(selected.theme, lang)
  // Locale datasets may have different category counts. Reset invalid selections.
  const stage = selected.stage < recipe.stages.length ? selected.stage : 0
  return { ...selected, stage, recipe }
}
export default async function StagePage({ params }: { params: Params }) {
  const { bookPath, lang } = await params
  setRequestLocale(lang)
  const s = selection(bookPath, lang)
  const canonical = bookHref(s.theme, s.stage)
  if (`/book/${bookPath.join('/')}` !== canonical) redirect(`/${lang}${canonical}`)
  return <MenuItemList key={`${s.theme}:${lang}:${s.stage}`} stageId={s.stage} recipeId={s.theme} />
}
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { bookPath, lang } = await params
  const s = selection(bookPath, lang)
  const stage = s.recipe.getStage(s.stage).pipe(Effect.runSync)
  return { title: `${stage.getName(lang)} - OW Restaurant` }
}
