import { Effect, Logger, LogLevel } from 'effect'
import { loadWorkshopCode, WorkshopCodeType } from './code-loader'
import { CodeParser } from './code-parser'
import { RecipeBuilder } from './recipe-builder'
import { saveRecipeToJson } from './recipe-saver'

export async function run() {
  const program = Effect.gen(function* () {
    const koreanWorkshopCode = yield* loadWorkshopCode(WorkshopCodeType.Ko)
    yield* Effect.logInfo('Loaded workshop codes')

    const koreanWorkshopCodeParser = new CodeParser(koreanWorkshopCode)
    const koreanConfig = yield* koreanWorkshopCodeParser.parse()
    yield* Effect.logInfo('Parsed workshop codes')

    const recipeBuilder = new RecipeBuilder(koreanConfig)
    yield* recipeBuilder.build()
    yield* Effect.logInfo('Built recipes from workshop codes')

    yield* saveRecipeToJson(recipeBuilder)
    yield* Effect.logInfo('Saved recipes to JSON')
  }).pipe(Effect.andThen(Effect.void))

  const caughtProgram = program.pipe(
    Effect.catchTags({
      WorkshopCodeFileReadError: (error) =>
        Effect.logError(`Failed to read workshop code file`, {
          workshopCodeType: error.workshopCodeType,
        }),
      WorkshopConfigBlockExtractionError: (error) =>
        Effect.logError(`Failed to extract config block from workshop code`, {
          workshopConfigKey: error.workshopConfigKey,
        }),
      WorkshopArrayBlockParsingError: (error) =>
        Effect.logError(`Failed to parse workshop code file (Array block)`),
      WorkshopStringBlockParsingError: (error) =>
        Effect.logError(`Failed to parse workshop code file (String block)`),
      RecipeFileSaveError: (error) =>
        Effect.logError(`Failed to save recipe file`, { path: error.path }),
    }),
    Effect.catchAll((error) => Effect.logError(`Uncaught error occurred`, error)),
    Effect.catchAllDefect((error) => Effect.logFatal(`Fatal error occurred`, error))
  )

  const loggedProgram = caughtProgram.pipe(
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.provide(Logger.pretty)
  )

  return Effect.runPromise(loggedProgram)
}
