'use client'
import items from '@/content/info/ko/items.json'
import { useInfoLocale } from './useInfoLocale'
import { useState } from 'react'
import '../stage-selector.css'
import GuideMarkdown from './GuideMarkdown'

const categories = ['전체', '칼', '도구', '이동 장비', '기타']
export default function ItemsGuide({ markdown }: { markdown: string }) {
  const {t} = useInfoLocale()
  const [category, setCategory] = useState(0)
  const sections = markdown.split(/(?=^## \[item \d+\])/m)
  const selected = sections.slice(1).filter((section) => {
    const id = Number(section.match(/^## \[item (\d+)\]/)?.[1])
    return category === 0 || items.find((item) => item.id === id)?.category === categories[category]
  })
  selected.sort((a, b) => {
    const categoryIndex = (section: string) => {
      const id = Number(section.match(/^## \[item (\d+)\]/)?.[1])
      return categories.indexOf(items.find((item) => item.id === id)?.category || '')
    }
    return categoryIndex(a) - categoryIndex(b)
  })
  return (
    <>
      <GuideMarkdown value={sections[0]} />
      <nav aria-label={t('items')} className="mt-24 flex flex-wrap gap-8">
        {['all','knives','tools','movement','other'].map((key)=>t(key)).map((label, index) => (
          <button
            type="button"
            key={label}
            onClick={() => setCategory(index)}
            aria-pressed={category === index}
            data-active={category === index}
            className="recipe-category rounded-8 text-14 px-12 py-6 font-semibold transition-colors"
          >
            {label}
          </button>
        ))}
      </nav>
      <GuideMarkdown value={selected.join('\n\n')} />
    </>
  )
}
