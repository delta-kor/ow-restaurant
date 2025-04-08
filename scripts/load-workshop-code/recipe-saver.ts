import { Effect, Schema } from 'effect'
import { promises as fs } from 'fs'
import path from 'path'
import { RecipeBuilder } from './recipe-builder'

export class RecipeFileSaveError extends Schema.TaggedError<RecipeFileSaveError>()(
  'RecipeFileSaveError',
  { path: Schema.String }
) {}

export function saveRecipeToJson(recipeBuilder: RecipeBuilder) {
  return Effect.gen(function* () {
    const filePath = path.join(__dirname, '../../store/recipe.json')
    yield* Effect.tryPromise({
      try: () => fs.writeFile(filePath, JSON.stringify(recipeBuilder), 'utf-8'),
      catch: () => new RecipeFileSaveError({ path: filePath }),
    })
  })
}
