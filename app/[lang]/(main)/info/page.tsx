import { getInfoLocale, resolveInfoTerms } from '@/lib/info-locales'
import InfoGuide from '@/components/info/InfoGuide'
import { setRequestLocale } from 'next-intl/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function generateMetadata({params}: {params: Promise<{lang:string}>}) {
  const {lang}=await params
  return {title: `${getInfoLocale(lang).t('gameInfo')} | OW Restaurant`}
}

export default async function InfoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)
  const locale = getInfoLocale(lang).lang
  const [markdown, itemMarkdown, modeMarkdown] = await Promise.all(
    ['customers', 'items', 'modes'].map((name) =>
      readFile(path.join(process.cwd(), `content/info/${locale}/${name}.md`), 'utf8').then((value) => resolveInfoTerms(value, locale))
    )
  )
  return <InfoGuide markdown={markdown} itemMarkdown={itemMarkdown} modeMarkdown={modeMarkdown} />
}
