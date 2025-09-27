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
  {
    name: '3호점',
    code: 'ST6Z6',
    recipeId: 'third',
  },
  {
    name: '쿡제요리',
    code: 'P6ZAA',
    recipeId: 'cook-intl',
  },
  {
    name: 'Cafe (中文)',
    code: 'WM3MW',
    recipeId: 'cafe-zh-CN',
  },
]

export function getCustomRestaurantInfo(recipeId: string | null): CustomRestaurantInfo | null {
  if (recipeId === null) return null
  return CustomRestaurantInfos.find((info) => info.recipeId === recipeId) || null
}

export const FormUrl = 'https://forms.gle/7q6RrbwRUAfo6UWbA'
