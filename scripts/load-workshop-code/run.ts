import { Effect, Logger, LogLevel } from 'effect'
import { loadWorkshopCode, WorkshopCodeType } from './code-loader'
import { CodeParser } from './code-parser'

export async function run() {
  const program = Effect.gen(function* () {
    const koreanWorkshopCode = yield* loadWorkshopCode(WorkshopCodeType.Ko)
    const koreanWorkshopCodeParser = new CodeParser(koreanWorkshopCode)
    const config = yield* koreanWorkshopCodeParser.parse()
    yield* Effect.logDebug(config)
  }).pipe(Effect.andThen(Effect.void))

  const caughtProgram = program.pipe(
    Effect.catchTags({
      WorkshopCodeFileReadError: (error) =>
        Effect.logError(`Failed to read workshop code file`, {
          workshopCodeType: error.workshopCodeType,
        }),
      WorkshopConfigBlockExtractionError: (error) =>
        Effect.logError(`Failed to extract block from workshop code`, {
          workshopConfigKey: error.workshopConfigKey,
        }),
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
