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
  private readonly type: ActionType
  private readonly input: Item[]
  private readonly output: Item[]
  private readonly effort: number | null

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
}
