import { Recipe } from '@/lib/restaurant/recipe'
import CafeRecipeJson from '@/store/recipe-cafe.json'
import RecipeJson from '@/store/recipe.json'
import { Effect } from 'effect'

export const recipe = Recipe.create(RecipeJson).pipe(Effect.runSync)
const cafeRecipe = Recipe.create(CafeRecipeJson).pipe(Effect.runSync)

export function getRecipe(id: string | null) {
  if (id === null) return recipe
  if (id === 'cafe') return cafeRecipe

  console.warn(`Recipe id ${id} not found, returning default recipe`)
  return recipe
}
