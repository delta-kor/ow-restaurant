export interface CustomRestaurantInfo {
  name: string
  code: string
  recipeId: string
}

export const CustomRestaurantInfos: CustomRestaurantInfo[] = [
  {
    name: '카페',
    code: 'WM3MW',
    recipeId: 'cafe',
  },
]

export function getCustomRestaurantInfo(recipeId: string | null): CustomRestaurantInfo | null {
  if (recipeId === null) return null
  return CustomRestaurantInfos.find((info) => info.recipeId === recipeId) || null
}
