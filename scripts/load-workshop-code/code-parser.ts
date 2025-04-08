import { Effect, Schema } from 'effect'
import { WorkshopConfig, WorkshopConfigKeys, WorkshopConfigType } from './code-keys'

export class WorkshopConfigBlockExtractionError extends Schema.TaggedError<WorkshopConfigBlockExtractionError>()(
  'WorkshopConfigBlockExtractionError',
  { workshopConfigKey: Schema.String }
) {}

export class WorkshopArrayBlockParsingError extends Schema.TaggedError<WorkshopArrayBlockParsingError>()(
  'WorkshopArrayBlockParsingError',
  {}
) {}

export class WorkshopStringBlockParsingError extends Schema.TaggedError<WorkshopStringBlockParsingError>()(
  'WorkshopStringBlockParsingError',
  {}
) {}

export class CodeParser {
  constructor(private readonly workshopCode: string) {}

  public parse() {
    return Effect.gen(this, function* (this: CodeParser) {
      const workshopConfig: Partial<WorkshopConfig> = {}

      for (const [configKey, configInfo] of WorkshopConfigKeys) {
        const block = yield* this.extractBlock(configKey)
        const configName = configInfo.name

        if (configInfo.type === WorkshopConfigType.Array) {
          const data = yield* this.parseArrayBlock(block)
          workshopConfig[configName] = data as any
        }

        if (configInfo.type === WorkshopConfigType.STRING) {
          const data = yield* this.parseStringBlock(block)
          workshopConfig[configName] = data as any
        }
      }

      return workshopConfig as WorkshopConfig
    })
  }

  private extractBlock(workshopConfigKey: string) {
    return Effect.gen(this, function* (this: CodeParser) {
      const lines = this.workshopCode.split('\n')

      const blockStartIndex = lines.findIndex((line) =>
        line.trimStart().startsWith(`Global.${workshopConfigKey} =`)
      )

      if (blockStartIndex === -1) {
        yield* Effect.fail(new WorkshopConfigBlockExtractionError({ workshopConfigKey }))
      }

      const blockEndIndex = lines.findIndex(
        (line, index) => line.trimEnd().endsWith(';') && index > blockStartIndex
      )

      if (blockEndIndex === -1) {
        yield* Effect.fail(new WorkshopConfigBlockExtractionError({ workshopConfigKey }))
      }

      const blockLines = lines.slice(blockStartIndex, blockEndIndex + 1)
      const blockText = blockLines.map((line) => line.trim()).join('')

      return blockText
    })
  }

  private parseArrayBlock<T>(block: string) {
    return Effect.gen(function* () {
      const arrayText = block.match(/Array\((.*)\);/)?.[1]
      if (!arrayText) return yield* Effect.fail(new WorkshopArrayBlockParsingError())

      const tokens: string[] = []
      let currentToken = ''
      let parenthesesCount = 0

      for (let i = 0; i < arrayText.length; i++) {
        const char = arrayText[i]

        if (char === '(') {
          parenthesesCount++
          currentToken += char
        } else if (char === ')') {
          parenthesesCount--
          currentToken += char
        } else if (char === ',' && parenthesesCount === 0) {
          tokens.push(currentToken.trim())
          currentToken = ''
          while (i + 1 < arrayText.length && arrayText[i + 1] === ' ') {
            i++
          }
        } else {
          currentToken += char
        }
      }

      if (currentToken.length > 0) {
        tokens.push(currentToken.trim())
      }

      return tokens.map((token) => {
        if (token.startsWith('Array(') && token.endsWith(')')) {
          const innerContent = token.slice(6, -1)
          return innerContent.split(',').map((numStr) => Number(numStr.trim()))
        } else if (token.toLowerCase() === 'false') {
          return false
        } else if (token.toLowerCase() === 'true') {
          return true
        } else {
          return parseInt(token)
        }
      }) as T
    })
  }

  private parseStringBlock(block: string) {
    return Effect.gen(function* () {
      const texts = block.match(/"(.*?)"/g)
      if (texts === null || texts.length === 0) {
        return yield* Effect.fail(new WorkshopStringBlockParsingError())
      }

      const joinedText = texts.map((text) => text.slice(1, -1).replace('{0}', '')).join('')
      const splits = joinedText.split('/')
      splits.pop()

      return splits
    })
  }
}
