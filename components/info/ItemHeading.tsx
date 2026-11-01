import Icon from '@/components/Icon'
import { useInfoLocale } from './useInfoLocale'

const assets =
  'https://raw.githubusercontent.com/Mitcheljager/workshop.codes/26aa289f7c648230b7dd2a7a031dd75d95362852/app/javascript/images'
const inputs: Record<string, { label: string; key?: string }> = {
  'primary-fire': { label: '좌클릭' },
  'secondary-fire': { label: '우클릭' },
  interact: { label: '상호작용', key: 'F' },
  ultimate: { label: '궁극기', key: 'Q' },
  jump: { label: '점프', key: 'Space' },
  'ability-1': { label: '기술 1', key: 'Shift' },
}
export default function ItemHeading({
  item,
}: {
  item: {
    id: number
    name: string
    color: string
    category: string
    icon: string | null
    singleUse: boolean
    durabilityCost: number | null
    durabilityUnit: string
    knifeEfficiency: number | null
    modes: { id: number; name: string; color: number[]; themes: string[] }[]
    keys: string[]
  }
}) {
  const {terms,t,category,theme} = useInfoLocale()
  const unit = t(item.category === '칼' ? 'cut' : item.durabilityUnit === '작동 1회' ? 'activation' : 'use')
  const defaultModes = item.modes.every((mode)=>mode.themes.length > 0)
  return (
    <>
      <span className="guide-item-heading">
        <span className="guide-item-circle" style={{ backgroundColor: item.color }}>
          {item.icon ? (
            <img
              src={`${assets}/abilities/128/${item.icon}.png`}
              alt=""
              width={36}
              height={36}
              loading="lazy"
            />
          ) : item.category === '칼' ? (
            <Icon.Knife aria-hidden="true" className="size-28 text-white" />
          ) : (
            <span aria-hidden="true">$</span>
          )}
        </span>
        <span>{item.name}</span>
        <span
          className="guide-input-tag"
          aria-label={`${t('input')}: ${item.keys.map((key) => t(key)).join(' + ')}`}
          title={t('keyHelp')}
        >
          <span className="guide-input-caption">{t('input')}</span>
          {item.keys.map((key, index) => (
            <span key={key} className="guide-input-key">
              {index > 0 && <span aria-hidden="true">+</span>}
              {key === 'primary-fire' || key === 'secondary-fire' ? (
                <img
                  className="guide-mouse-key"
                  src={`${assets}/controls/pc/${key}.png`}
                  alt={t(key)}
                  width={22}
                  height={26}
                />
              ) : (
                <kbd>{inputs[key].key}</kbd>
              )}
            </span>
          ))}
        </span>
        {item.category === '칼' && (
          <span
            className="guide-usage-tag"
            title={t('efficiencyHelp',{knife:terms.items['1']})}
          >
            {t('efficiency',{value:(item.knifeEfficiency ?? 100) / 100})}
          </span>
        )}
        {(item.singleUse || item.durabilityCost !== null) && (
          <span
            className="guide-usage-tag"
            data-single-use={item.singleUse}
            title={
              item.singleUse
                ? t('singleUseHelp')
                : t('wearHelp',{unit,value:item.durabilityCost ?? 0}) + (item.durabilityUnit === '작동 1회' ? t('repeatHelp') : '')
            }
          >
            {item.category === '칼'
              ? t('durability',{value:item.durabilityCost ?? 0})
              : item.singleUse
                ? t('singleUse')
                : item.durabilityCost! >= 5
                  ? t('uses',{value:Math.floor(100 / item.durabilityCost!)})
                  : t('wear',{unit,value:item.durabilityCost ?? 0})}
          </span>
        )}
      </span>
      <span className="guide-item-meta">
      <span className="guide-item-category" data-category={item.category}>{category(item.category)}</span>
      {item.modes?.length > 0 && (
        <span
          className="guide-mode-tags guide-item-mode-group"
          data-default={defaultModes}
          role="group"
          aria-label={defaultModes ? t('defaultProvided') : t('appearanceModes')}
        >
          {defaultModes && (
            <span className="guide-item-mode-label">{t('defaultProvided')}</span>
          )}
          {item.modes.map((mode) => (
            <span
              key={mode.id}
              className="guide-mode-tag"
              title={mode.themes.length ? t('defaultThemes',{themes:mode.themes.map(theme).join(', ')}) : t('fromFine',{mode:terms.modes[2]})}
              style={{
                backgroundColor: `var(--guide-mode-background-${mode.id}, rgba(${mode.color.join(',')}, 0.12))`,
                borderColor: `var(--guide-mode-border-${mode.id}, rgba(${mode.color.join(',')}, 0.38))`,
                color: `var(--guide-mode-text-${mode.id}, ${['#24323d', '#39724d', '#356795', '#80651e', '#a34b4b', '#51516d'][mode.id]})`,
              }}
            >
              {mode.themes.length ? terms.modes[mode.id] : t('fromFine',{mode:terms.modes[2]})}
            </span>
          ))}
        </span>
      )}
      </span>
    </>
  )
}
