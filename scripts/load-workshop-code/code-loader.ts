import { Effect, Schema } from 'effect'
import { promises as fs } from 'fs'
import path from 'path'

export enum WorkshopCodeType {
  Ko,
  En,
  Ja,
}

export class WorkshopCodeFileReadError extends Schema.TaggedError<WorkshopCodeFileReadError>()(
  'WorkshopCodeFileReadError',
  { workshopCodeType: Schema.Enums(WorkshopCodeType) }
) {}

export function loadWorkshopCode(type: WorkshopCodeType) {
  return Effect.gen(function* () {
    let fileName: string
    switch (type) {
      case WorkshopCodeType.Ko:
        fileName = 'workshop-code-ko.txt'
        break
      case WorkshopCodeType.En:
        fileName = 'workshop-code-en.txt'
        break
      case WorkshopCodeType.Ja:
        fileName = 'workshop-code-ja.txt'
        break
    }

    const filePath = path.join(__dirname, 'code', fileName)
    const file = yield* Effect.tryPromise({
      try: () => fs.readFile(filePath, 'utf-8'),
      catch: () => new WorkshopCodeFileReadError({ workshopCodeType: type }),
    })

    return file
  })
}
