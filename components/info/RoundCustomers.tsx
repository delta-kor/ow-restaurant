import schedules from '@/content/info/ko/round-customers.json'
import customers from '@/content/info/ko/customers.json'
import { useInfoLocale } from './useInfoLocale'

const portraits = 'https://raw.githubusercontent.com/Mitcheljager/workshop.codes/26aa289f7c648230b7dd2a7a031dd75d95362852/app/javascript/images/heroes/2d/50'

export default function RoundCustomers({ mode }: { mode: number }) {
  const {t,terms} = useInfoLocale()
  const schedule = schedules.find((schedule) => schedule.mode === mode)
  if (!schedule) return null
  const customer = (slug: string) => (
    <span key={slug} className={`guide-round-customer ${customers.find((c)=>c.slug===slug)?.boss ? 'guide-boss-name' : ''}`}>
      <img src={`${portraits}/${slug}.png`} alt="" width={28} height={28} loading="lazy" />
      {terms.customers[slug]}
    </span>
  )
  return <details className="guide-round-customers">
    <summary>{t('roundGuests')}</summary>
    <p className="guide-round-note">{t('roundGuestsHelp')}</p>
    <ol className="guide-round-list">
      {schedule.rounds.map((round) => <li key={round.round} className="guide-round-row">
        <span className="guide-round-number">
          {t('roundNumber',{value:round.round})}
          {round.bonus && <span className="guide-round-bonus">{t('bonusRound')}</span>}
        </span>
        <span className="guide-round-customer-list">
          {round.customers.map((entry,index)=> entry.random
            ? <span key={index} className="guide-random-customers">
                <span className="guide-random-label">{t('randomBoss')}</span>
                {entry.heroes.map(customer)}
              </span>
            : entry.heroes.map(customer))}
        </span>
      </li>)}
    </ol>
  </details>
}
