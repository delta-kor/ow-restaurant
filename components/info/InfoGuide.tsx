'use client'
import { useInfoLocale } from './useInfoLocale'
import Icon from '@/components/Icon'
import LanguageSelector from '@/components/LanguageSelector'
import { useState } from 'react'
import GuideMarkdown from './GuideMarkdown'
import ItemsGuide from './ItemsGuide'
import ModesGuide from './ModesGuide'
import './info.css'
export default function InfoGuide({
  markdown,
  itemMarkdown,
  modeMarkdown,
}: {
  markdown: string
  itemMarkdown: string
  modeMarkdown: string
}) {
  const {t: text} = useInfoLocale()
  const t = ['customers','items','modes','tips','guide','comingSoon'].map((key)=>text(key))
  const [tab, setTab] = useState(0)
  return (
    <main className="info-page tablet:py-48 w-full min-w-0 py-32">
      <header className="flex flex-wrap items-center justify-between gap-20">
        <div>
          <div className="text-primary flex items-center gap-12">
            <Icon.Info className="size-32" />
            <h1 className="text-32 font-bold">{text('gameInfo')}</h1>
          </div>
          <p className="text-gray text-16 mt-8">{t[4]}</p>
        </div>
        <LanguageSelector />
      </header>
      <nav aria-label={text('gameInfo')} className="my-28 flex flex-wrap gap-8">
        {t.slice(0, 4).map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={tab === i}
            onClick={() => setTab(i)}
            className={`rounded-12 px-20 py-12 font-semibold transition-colors ${tab === i ? 'bg-primary text-white' : 'bg-primary-background text-gray hover:text-primary'}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <section className="rounded-16 border-light-gray tablet:p-32 border p-24">
        {tab === 0 ? (
          <GuideMarkdown value={markdown} />
        ) : tab === 1 ? (
          <ItemsGuide markdown={itemMarkdown} />
        ) : tab === 2 ? (
          <ModesGuide markdown={modeMarkdown} />
        ) : (
          <div className="text-gray py-48">
            <h2 className="text-24 mb-12 font-bold">{t[tab]}</h2>
            <p>{t[5]}</p>
          </div>
        )}
      </section>
    </main>
  )
}
