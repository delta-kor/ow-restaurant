import { useInfoLocale } from './useInfoLocale'
type Score = { adjustment: number; orders: number; multiPlate: boolean; bonus: number }
export default function CustomerScore({ score }: { score: Score }) {
  const {t,terms} = useInfoLocale()
  const { adjustment, orders, multiPlate, bonus } = score
  if (adjustment === 0 && orders === 1 && !multiPlate && bonus === 0) return null
  const delta = `${adjustment > 0 ? '+' : ''}${adjustment}`
  let label = adjustment === 0 ? t('scoreSame') : t('scoreAdjust',{value:delta})
  let explanation =
    t('scoreHelp',{customer:terms.customers.soldier76})
  if (orders > 1) {
    label = t('scoreExtra',{orders:orders-1,value:delta})
    explanation += t('scoreExtraHelp',{orders:orders-1})
  }
  if (multiPlate) {
    label = t('scoreMulti')
    explanation =
      t('scoreMultiHelp')
  }
  if (bonus) {
    label += t('scoreBonus',{value:bonus})
    explanation += t('scoreBonusHelp',{value:bonus})
  }
  return (
    <span
      className="guide-score"
      data-tone={
        multiPlate
          ? 'mechanic'
          : adjustment < 0
            ? 'penalty'
            : adjustment > 0 || orders > 1 || bonus > 0
              ? 'advantage'
              : 'neutral'
      }
      title={explanation}
      aria-label={t('scoreRelative',{label,explanation})}
    >
      {label}
    </span>
  )
}
