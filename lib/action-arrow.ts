import Icon from '@/components/Icon'
import { Action, ActionType } from '@/lib/restaurant/action'

export function getActionName(action: Action, t: any) {
  const type = action.type
  switch (type) {
    case ActionType.Cut:
      return t('cut')
    case ActionType.Grill:
      return t('grill')
    case ActionType.Fry:
      return t('fry')
    case ActionType.Pot:
      return t('pot')
    case ActionType.Pan:
      return t('pan')
    case ActionType.Impact:
      return t('impact')
    case ActionType.Mix:
      return t('mix')
  }
}

export function getActionIcon(action: Action) {
  const type = action.type
  switch (type) {
    case ActionType.Cut:
      return Icon.Knife
    case ActionType.Grill:
      return Icon.Grill
    case ActionType.Fry:
      return Icon.Fry
    case ActionType.Pot:
      return Icon.Pot
    case ActionType.Pan:
      return Icon.Pan
    case ActionType.Impact:
      return Icon.Impact
    case ActionType.Mix:
      return Icon.Mix
  }
}
