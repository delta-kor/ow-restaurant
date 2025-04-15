import { useTranslations } from 'next-intl'

export default function GameTutorial() {
  const t = useTranslations()

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="text-14 text-gray flex items-center gap-4 font-semibold">
        {t.rich('gameTutorialImpact', {
          key: (text) => (
            <span className="bg-primary-background rounded-4 text-12 px-4 py-2">{text}</span>
          ),
        })}
      </div>
      <div className="text-14 text-gray flex items-center gap-4 font-semibold">
        {t.rich('gameTutorialChop', {
          key: (text) => (
            <span className="bg-primary-background rounded-4 text-12 px-4 py-2">{text}</span>
          ),
        })}
      </div>
    </div>
  )
}
