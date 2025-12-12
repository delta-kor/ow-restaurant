import { Recipe } from '@/lib/restaurant/recipe'
import CafeEnRecipeJson from '@/store/recipe-cafe-en.json'
import CafeZhCNRecipeJson from '@/store/recipe-cafe-zh-CN.json'
import CafeRecipeJson from '@/store/recipe-cafe.json'
import CookIntlEnRecipeJson from '@/store/recipe-cook-intl-en.json'
import CookIntlRecipeJson from '@/store/recipe-cook-intl.json'
import ThirdRecipeJson from '@/store/recipe-third.json'
import RecipeJson from '@/store/recipe.json'
import { Effect } from 'effect'

import { notFound } from 'next/navigation'

export const recipe = Recipe.create(RecipeJson).pipe(Effect.runSync)
const cafeRecipe = Recipe.create(CafeRecipeJson).pipe(Effect.runSync)
const thirdRecipe = Recipe.create(ThirdRecipeJson).pipe(Effect.runSync)
const cookIntlRecipe = Recipe.create(CookIntlRecipeJson).pipe(Effect.runSync)

const cafeEnRecipe = Recipe.create(CafeEnRecipeJson).pipe(Effect.runSync)
const cookIntlEnRecipe = Recipe.create(CookIntlEnRecipeJson).pipe(Effect.runSync)

const cafeZhCNRecipe = Recipe.create(CafeZhCNRecipeJson).pipe(Effect.runSync)

export function getRecipe(id: string | null) {
  if (id === null) return recipe
  if (id === 'cafe') return cafeRecipe
  if (id === 'third') return thirdRecipe
  if (id === 'cook-intl') return cookIntlRecipe

  if (id === 'cafe-en') return cafeEnRecipe
  if (id === 'cook-intl-en') return cookIntlEnRecipe

  if (id === 'cafe-zh-CN') return cafeZhCNRecipe

  notFound()
}
