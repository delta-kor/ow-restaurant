import items from '@/content/info/ko/items.json'
import loadouts from '@/content/info/ko/mode-loadouts.json'
import Icon from '@/components/Icon'
import GuideMarkdown from './GuideMarkdown'
import { useInfoLocale } from './useInfoLocale'
import RoundCustomers from './RoundCustomers'

const assets = 'https://raw.githubusercontent.com/Mitcheljager/workshop.codes/26aa289f7c648230b7dd2a7a031dd75d95362852/app/javascript/images/abilities/128'

export default function ModesGuide({ markdown }: { markdown: string }) {
  const {terms,t,theme} = useInfoLocale()
  const [intro, ...sections] = markdown.split(/(?=^## )/m)
  return <>
    <GuideMarkdown value={intro} />
    {sections.map((section, index) => {
      const end = section.indexOf('\n')
      const loadout = loadouts.find((mode) => mode.id === index)
      return <section key={index} className="guide-mode-section" style={{
        '--guide-mode-mechanic': `var(--guide-mode-text-${index}, ${['#b52c69', '#39724d', '#356795', '#80651e', '#a34b4b', '#51516d'][index]})`,
      } as import('react').CSSProperties}>
        <GuideMarkdown value={section.slice(0, end)} />
        {index !== 0 && loadout && <div className="guide-mode-loadout">
          <div className="guide-loadout-label">{t('defaultItems')}</div>
          {loadout.groups.map((group) => <div key={group.themes.join()} className="guide-loadout-row">
            {loadout.groups.length > 1 && <span className="guide-loadout-theme">{group.themes.map(theme).join(' / ')}</span>}
            <span className="guide-loadout-items">
              {group.items.map((id) => {
                const item = items.find((item) => item.id === id)!
                return <span key={id} className="guide-loadout-item">
                  <span className="guide-item-circle" style={{backgroundColor:item.color}}>
                    {item.icon ? <img src={`${assets}/${item.icon}.png`} alt="" width={24} height={24} loading="lazy" /> : <Icon.Knife aria-hidden="true" className="size-20 text-white" />}
                  </span>
                  {terms.items[String(item.id)]}
                </span>
              })}
            </span>
          </div>)}
        </div>}
        {index !== 0 && <RoundCustomers mode={index} />}
        <div className="guide-mode-description">
          <GuideMarkdown value={section.slice(end + 1)} />
        </div>
      </section>
    })}
  </>
}
