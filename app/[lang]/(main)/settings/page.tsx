import SettingsContent from '@/components/SettingsContent'
import { setRequestLocale } from 'next-intl/server'

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  setRequestLocale(lang)

  const hash = process.env.VERCEL_GIT_COMMIT_SHA || '-'
  const deployId = process.env.VERCEL_DEPLOYMENT_ID || '-'
  const region = process.env.VERCEL_REGION || '-'

  return (
    <div className="flex flex-col gap-4">
      <SettingsContent />
      <div className="text-12 text-light-gray-hover">
        R: {region} | D: {deployId} | H: {hash}
      </div>
    </div>
  )
}
