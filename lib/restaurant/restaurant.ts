import { Recipe } from '@/lib/restaurant/recipe'
import CafeRecipeJson from '@/store/recipe-cafe.json'
import ThirdRecipeJson from '@/store/recipe-third.json'
import RecipeJson from '@/store/recipe.json'
import { Effect } from 'effect'
import { notFound } from 'next/navigation'

export const recipe = Recipe.create(RecipeJson).pipe(Effect.runSync)
const cafeRecipe = Recipe.create(CafeRecipeJson).pipe(Effect.runSync)
const thirdRecipe = Recipe.create(ThirdRecipeJson).pipe(Effect.runSync)

export function getRecipe(id: string | null) {
  if (id === null) return recipe
  if (id === 'cafe') return cafeRecipe
  if (id === 'third') return thirdRecipe

  notFound()
}
