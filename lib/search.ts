import { MenuFlowLineInfo } from '@/app/[lang]/(main)/book/[stageId]/page'

export function normalizeSearchText(searchText: string): string {
  return searchText.trim().toLowerCase()
}

export function filterFlowLineInfosWithSearchQuery(
  flowLineInfos: MenuFlowLineInfo[],
  searchText: string
): MenuFlowLineInfo[] {
  const normalizedSearchText = normalizeSearchText(searchText)

  return flowLineInfos.filter((info) => {
    const koreanMenuName = info.item.getName('ko')
    const normalizedKoreanMenuName = normalizeSearchText(koreanMenuName)

    const englishMenuName = info.item.getName('en')
    const normalizedEnglishMenuName = normalizeSearchText(englishMenuName)

    const japaneseMenuName = info.item.getName('ja')
    const normalizedJapaneseMenuName = normalizeSearchText(japaneseMenuName)

    return (
      normalizedKoreanMenuName.includes(normalizedSearchText) ||
      normalizedEnglishMenuName.includes(normalizedSearchText) ||
      normalizedJapaneseMenuName.includes(normalizedSearchText)
    )
  })
}
