import SettingsContent from '@/components/SettingsContent'
import { setRequestLocale } from 'next-intl/server'

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)

  return <SettingsContent />
}
