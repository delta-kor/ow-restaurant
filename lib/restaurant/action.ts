import { Item } from '@/lib/restaurant/item'

export enum ActionType {
  Cut,
  Grill,
  Fry,
  Pot,
  Pan,
  Impact,
  Mix,
}

interface ActionConfigBase {
  input: Item[]
  output: Item[]
}

export interface EffortlessActionConfig extends ActionConfigBase {
  type: ActionType.Impact | ActionType.Mix
}

export interface EffortfulActionConfig extends ActionConfigBase {
  type: Exclude<ActionType, ActionType.Impact | ActionType.Mix>
  effort: number
}

export type ActionConfig = EffortlessActionConfig | EffortfulActionConfig

export class Action {
  public readonly type: ActionType
  public readonly input: Item[]
  public readonly output: Item[]
  public readonly effort: number | null

  constructor(config: ActionConfig) {
    this.type = config.type
    this.input = config.input
    this.output = config.output

    if (config.type === ActionType.Impact || config.type === ActionType.Mix) {
      this.effort = null
    } else {
      this.effort = (config as EffortfulActionConfig).effort
    }
  }

  public toJSON() {
    return {
      type: this.type,
      input: this.input.map((item) => item.id),
      output: this.output.map((item) => item.id),
      effort: this.effort,
    }
  }

  public toDebugString() {
    let type: string
    switch (this.type) {
      case ActionType.Cut:
        type = 'Cut'
        break
      case ActionType.Grill:
        type = 'Grill'
        break
      case ActionType.Fry:
        type = 'Fry'
        break
      case ActionType.Pot:
        type = 'Pot'
        break
      case ActionType.Pan:
        type = 'Pan'
        break
      case ActionType.Impact:
        type = 'Impact'
        break
      case ActionType.Mix:
        type = 'Mix'
        break
    }

    return `${type} ${this.input.map((item) => item.getName('ko')).join(' + ')} -> ${this.output
      .map((item) => item.getName('ko'))
      .join(', ')}`
  }
}
