import customers from '@/content/info/ko/customers.json'
import items from '@/content/info/ko/items.json'
import { Children, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CustomerScore from './CustomerScore'
import ItemHeading from './ItemHeading'
import { useInfoLocale } from './useInfoLocale'

const heroNames = new Set([
  'ana',
  'anran',
  'ashe',
  'baptiste',
  'bastion',
  'brigitte',
  'cassidy',
  'dmon',
  'doctrine',
  'domina',
  'doomfist',
  'dva',
  'echo',
  'emre',
  'freja',
  'genji',
  'hanzo',
  'hazard',
  'illari',
  'jetpackcat',
  'junkerqueen',
  'junkrat',
  'juno',
  'kiriko',
  'lifeweaver',
  'lucio',
  'mauga',
  'mei',
  'mercy',
  'mizuki',
  'moira',
  'orisa',
  'pharah',
  'ramattra',
  'reaper',
  'reinhardt',
  'roadhog',
  'shion',
  'sierra',
  'sigma',
  'sojourn',
  'soldier76',
  'sombra',
  'symmetra',
  'torbjorn',
  'tracer',
  'vendetta',
  'venture',
  'widowmaker',
  'winston',
  'wreckingball',
  'wuyang',
  'zarya',
  'zenyatta',
])
const assetRoot =
  'https://raw.githubusercontent.com/Mitcheljager/workshop.codes/26aa289f7c648230b7dd2a7a031dd75d95362852/app/javascript/images/heroes/2d'
function heroes(children: ReactNode, difficulties: string[]): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child !== 'string') return child
    const escaped = difficulties.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    return child.split(new RegExp(`(\\[hero [^\\]]+\\]|${escaped})`, 'g')).map((part, index) => {
      const difficulty = difficulties.indexOf(part)
      if (difficulty >= 0) return <span key={index} className="guide-difficulty" style={{color: `var(--guide-mode-text-${difficulty + 1}, ${['#39724d', '#356795', '#80651e', '#a34b4b'][difficulty]})`, fontWeight: 700}}>{part}</span>
      const match = part.match(/^\[hero (.*?)(?:\s*\{\s*size:\s*["'](medium|large)["']\s*\})?\]$/)
      if (!match) return part
      const slug = match[1]
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
      if (!heroNames.has(slug)) return part
      const size = match[2] === 'large' ? 256 : match[2] === 'medium' ? 100 : 50
      return (
        <img
          key={index}
          src={`${assetRoot}/${size}/${slug}.png`}
          alt={match[1]}
          width={size}
          height={size}
          loading="lazy"
          className="guide-hero"
        />
      )
    })
  })
}
export default function GuideMarkdown({ value }: { value: string }) {
  const {terms,t,category} = useInfoLocale()
  const renderInline = (children:ReactNode) => heroes(children, terms.difficulties)
  return (
    <div className="guide-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{renderInline(children)}</h1>,
          h2: ({ children }) => {
            const title = Children.toArray(children)
              .filter((child) => typeof child === 'string')
              .join('')
            const rounds = [...title.matchAll(/\[([^\]]+)\]/g)].filter((match)=>!match[1].startsWith('hero ') && !match[1].startsWith('item '))
            const modeId = terms.modes.indexOf(title.replace(/\s*\[[^\]]+\]/g, ''))
            if (modeId >= 0)
              return (
                <h2 style={{color: `var(--guide-mode-text-${modeId}, ${['#b52c69', '#39724d', '#356795', '#80651e', '#a34b4b', '#51516d'][modeId]})`}}>
                  <span>{title.replace(/\s*\[[^\]]+\]/g, '')}</span>
                  <span className="guide-round-tags">
                    {rounds.map((match, index) => (
                      <span key={index} className="guide-round-tag">{match[1]}</span>
                    ))}
                  </span>
                </h2>
              )
            const itemId = title.match(/\[item (\d+)\]/)?.[1]
            const item = items.find((item) => item.id === Number(itemId))
            if (item)
              return (
                <h2>
                  <ItemHeading item={{...item,name:terms.items[String(item.id)]}} />
                </h2>
              )
            const hero = title
              .match(/\[hero ([^\]]+)\]/)?.[1]
              ?.toLowerCase()
              .replace(/[^a-z0-9]/g, '')
            const customer = customers.find((customer) => customer.slug === hero)
            return (
              <h2>
                <span
                  className={`guide-customer-heading ${customer?.boss ? 'guide-boss-name' : ''}`}
                >
                  {customer ? renderInline(Children.map(children, (child) => typeof child === 'string' ? child.replace(customer.name,terms.customers[customer.slug]) : child)) : renderInline(children)}
                  {customer && <CustomerScore score={customer.score} />}
                </span>
                {customer && (
                  <span
                    className="guide-mode-tags guide-customer-mode-group"
                    role="group"
                    aria-label={t('appearsIn')}
                  >
                    <span className="guide-item-mode-label">{t('appearsIn')}</span>
                    {customer.modes.map((mode) => (
                      <span
                        key={mode.id}
                        className="guide-mode-tag"
                        style={{
                          backgroundColor: `var(--guide-mode-background-${mode.id}, rgba(${mode.color.join(',')}, 0.12))`,
                          borderColor: `var(--guide-mode-border-${mode.id}, rgba(${mode.color.join(',')}, 0.38))`,
                          color: `var(--guide-mode-text-${mode.id}, ${['#24323d', '#39724d', '#356795', '#80651e', '#a34b4b', '#51516d'][mode.id]})`,
                        }}
                      >
                        {terms.modes[mode.id]}
                      </span>
                    ))}
                  </span>
                )}
              </h2>
            )
          },
          h3: ({ children }) => <h3>{renderInline(children)}</h3>,
          p: ({ children }) => <p>{renderInline(children)}</p>,
          li: ({ children }) => <li>{renderInline(children)}</li>,
          strong: ({ children }) => <strong>{renderInline(children)}</strong>,
          a: ({ children, href }) => {
            if (href === '#advantage' || href === '#penalty' || href === '#mechanic') {
              return <span className={`guide-${href.slice(1)}`}>{children}</span>
            }
            return (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            )
          },
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  )
}
