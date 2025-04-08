export enum WorkshopConfigType {
  Array,
  STRING,
}

export interface WorkshopConfigInfo {
  name: keyof WorkshopConfig
  type: WorkshopConfigType
}

export const WorkshopConfigKeys: Map<string, WorkshopConfigInfo> = new Map()
WorkshopConfigKeys.set('ITEM_NAME', {
  name: 'itemName',
  type: WorkshopConfigType.STRING,
})
WorkshopConfigKeys.set('CUTTING_NEEDED', {
  name: 'cuttingNeeded',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('CUTTING_RESULT', {
  name: 'cuttingResult',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('GRILLING_NEEDED', {
  name: 'grillingNeeded',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('GRILLING_RESULT', {
  name: 'grillingResult',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('FRYING_NEEDED', {
  name: 'fryingNeeded',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('FRYING_RESULT', {
  name: 'fryingResult',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('POT_TIME', {
  name: 'potTime',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('POT_RESULT', {
  name: 'potResult',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('PAN_NEEDED', {
  name: 'panNeeded',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('PAN_RESULT', {
  name: 'panResult',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('IMPACT_RESULT', {
  name: 'impactResult',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('RAW_MIX', {
  name: 'rawMix',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('RAW_RESULT', {
  name: 'rawResult',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('MENU_LIST', {
  name: 'menuList',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('HAZARD_MENU_LIST', {
  name: 'hazardMenuList',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('FRIDGE_LIST', {
  name: 'fridgeList',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('MELT_LIST', {
  name: 'meltList',
  type: WorkshopConfigType.Array,
})
WorkshopConfigKeys.set('STAGE_NAME', {
  name: 'stageName',
  type: WorkshopConfigType.STRING,
})

export interface WorkshopConfig {
  itemName: string[]
  cuttingNeeded: number[]
  cuttingResult: (number | number[] | false)[]
  grillingNeeded: number[]
  grillingResult: (number | false)[]
  fryingNeeded: number[]
  fryingResult: (number | false)[]
  potTime: (number | false)[]
  potResult: (number | false)[]
  panNeeded: number[]
  panResult: (number | false)[]
  impactResult: (number | false)[]
  rawMix: number[]
  rawResult: number[]
  menuList: number[][]
  hazardMenuList: number[][]
  fridgeList: number[][]
  meltList: number[]
  stageName: string[]
}
