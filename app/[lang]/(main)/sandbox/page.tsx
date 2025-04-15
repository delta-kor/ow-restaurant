import Game from '@/components/Game'
import MobileModal from '@/components/MobileModal'
import { setRequestLocale } from 'next-intl/server'

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
