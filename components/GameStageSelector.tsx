import { Recipe } from '@/lib/restaurant/recipe'
import { useLocale, useTranslations } from 'next-intl'
import SelectMenu from './SelectMenu'

export default function GameStageSelector({
  recipe,
  stageId,
  onStageSelect,
}: {
  recipe: Recipe
  stageId: number
  onStageSelect: (id: number) => void
}) {
  const locale = useLocale(),
    t = useTranslations()
  return (
    <SelectMenu
      label={t('dishCategory')}
      value={String(stageId)}
      options={recipe.stages.map((stage) => ({
        value: String(stage.id),
        label: stage.getName(locale),
      }))}
      inline={true}
      onChange={(value) => onStageSelect(Number(value))}
    />
  )
}
