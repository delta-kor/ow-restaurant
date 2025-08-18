import { Effect, Logger, LogLevel } from 'effect'
import { loadWorkshopCode, WorkshopCodeType } from './code-loader'
import { CodeParser } from './code-parser'
import { RecipeBuilder } from './recipe-builder'
import { saveRecipeToJson } from './recipe-saver'

export async function run() {
  const mainProgram = Effect.gen(function* () {
    const koreanWorkshopCode = yield* loadWorkshopCode(WorkshopCodeType.Ko, 'code')
    const englishWorkshopCode = yield* loadWorkshopCode(WorkshopCodeType.En, 'code')
    const japaneseWorkshopCode = yield* loadWorkshopCode(WorkshopCodeType.Ja, 'code')
    const chineseWorkshopCode = yield* loadWorkshopCode(WorkshopCodeType.ZhCN, 'code')
    yield* Effect.logInfo('Loaded workshop codes')

    const koreanWorkshopCodeParser = new CodeParser(koreanWorkshopCode)
    const koreanConfig = yield* koreanWorkshopCodeParser.parse()

    const englishWorkshopCodeParser = new CodeParser(englishWorkshopCode)
    const englishConfig = yield* englishWorkshopCodeParser.parse()

    const japaneseWorkshopCodeParser = new CodeParser(japaneseWorkshopCode)
    const japaneseConfig = yield* japaneseWorkshopCodeParser.parse()

    const chineseWorkshopCodeParser = new CodeParser(chineseWorkshopCode)
    const chineseConfig = yield* chineseWorkshopCodeParser.parse()

    yield* Effect.logInfo('Parsed workshop codes')

    const recipeBuilder = new RecipeBuilder({
      koreanWorkshopConfig: koreanConfig,
      englishWorkshopConfig: englishConfig,
      japaneseWorkshopConfig: japaneseConfig,
      chineseWorkshopConfig: chineseConfig,
    })
    yield* recipeBuilder.build()
    yield* Effect.logInfo('Built recipes from workshop codes')

    yield* saveRecipeToJson(recipeBuilder, 'recipe')
    yield* Effect.logInfo('Saved recipes to JSON')
  }).pipe(Effect.andThen(Effect.void))

  const caughtProgram = mainProgram.pipe(
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

export async function runCustom(customId: string) {
  const customCodeProgram = Effect.gen(function* () {
    yield* Effect.annotateLogsScoped({ customId })
    yield* Effect.logInfo(`Loading custom workshop code with id: ${customId}`)

    const workshopCode = yield* loadWorkshopCode(WorkshopCodeType.Ko, `code-${customId}`)
    yield* Effect.logInfo('Loaded custom workshop code')

    const workshopCodeParser = new CodeParser(workshopCode)
    const config = yield* workshopCodeParser.parse()

    yield* Effect.logInfo('Parsed custom workshop codes')

    const recipeBuilder = new RecipeBuilder({
      koreanWorkshopConfig: config,
      englishWorkshopConfig: config,
      japaneseWorkshopConfig: config,
      chineseWorkshopConfig: config,
    })
    yield* recipeBuilder.build()
    yield* Effect.logInfo('Built recipes from custom workshop code')

    yield* saveRecipeToJson(recipeBuilder, `recipe-${customId}`)
    yield* Effect.logInfo('Saved custom recipes to JSON')
  }).pipe(Effect.scoped, Effect.andThen(Effect.void))

  const caughtProgram = customCodeProgram.pipe(
    Effect.catchTags({
      WorkshopCodeFileReadError: (error) =>
        Effect.logError(`Failed to read custom workshop code file`, {
          workshopCodeType: error.workshopCodeType,
        }),
      WorkshopConfigBlockExtractionError: (error) =>
        Effect.logError(`Failed to extract config block from custom workshop code`, {
          workshopConfigKey: error.workshopConfigKey,
        }),
      WorkshopArrayBlockParsingError: (error) =>
        Effect.logError(`Failed to parse custom workshop code file (Array block)`),
      WorkshopStringBlockParsingError: (error) =>
        Effect.logError(`Failed to parse custom workshop code file (String block)`),
      RecipeFileSaveError: (error) =>
        Effect.logError(`Failed to save custom recipe file`, { path: error.path }),
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
