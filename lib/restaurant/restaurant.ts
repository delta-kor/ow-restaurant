import { Recipe, RecipeJson } from '@/lib/restaurant/recipe'
import datasets from '@/store/datasets.json'
import { Effect } from 'effect'
import { notFound } from 'next/navigation'
import { editionFor, resolveTheme, selectDataLanguage, ThemeId } from './catalog'

const data = datasets as unknown as Record<ThemeId, Record<string, RecipeJson>>
const cache = new Map<string, Recipe>()
export function getRecipeSelection(id: string | null, locale: string) {
  const theme = resolveTheme(id)
  if (!theme) notFound()
  const language = selectDataLanguage(Object.keys(data[theme]), locale)
  const key = `${theme}:${language}`
  let recipe = cache.get(key)
  if (!recipe) {
    const source = data[theme][language]
    const configured = {
      ...source,
      stages: source.stages.map((stage) => ({
        ...stage,
        additionalMenu: editionFor(theme).butcherShopEnabled && (stage.additionalMenu ?? false),
      })),
    }
    recipe = Recipe.create(configured).pipe(Effect.runSync)
    cache.set(key, recipe)
  }
  return { recipe, language, theme }
}
export function getRecipe(id: string | null, locale = 'en') {
  return getRecipeSelection(id, locale).recipe
}
