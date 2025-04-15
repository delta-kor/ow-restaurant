import Game from '@/components/Game'
import MobileModal from '@/components/MobileModal'
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function SandboxPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)

  return (
    <div className="flex h-dvh grow items-center">
      <Game />
      <MobileModal />
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang })

  return {
    title: `${t('sandbox')} - OW Restaurant`,
  } satisfies Metadata
}
