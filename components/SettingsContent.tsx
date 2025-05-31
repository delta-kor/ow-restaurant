'use client'

import Icon from '@/components/Icon'
import { SettingsKey, useSettings } from '@/providers/Settings'
import { useLocale, useTranslations } from 'next-intl'

const LocaleOptions = [
  ['ko', '한국어'],
  ['en', 'English'],
  ['ja', '日本語'],
  ['zh-CN', '中文'],
  ['zh-TW', '中文(亚洲)'],
]

export function SettingsToggleOption({
  settingsKey,
  label,
}: {
  settingsKey: SettingsKey
  label: string
}) {
  const settings = useSettings()

  const handleToggleSetting = (settingsKey: SettingsKey) => {
    const newValue = !settings.data[settingsKey]
    settings.setData(settingsKey, newValue)
  }

  return (
    <div
      className="flex max-w-[480px] cursor-pointer items-center justify-between"
      onClick={() => handleToggleSetting(settingsKey)}
    >
      <div className="text-18 font-medium text-black">{label}</div>
      <div className="bg-light-gray flex size-16 items-center justify-center rounded-full">
        <div
          className="data-[active=true]:bg-primary size-8 rounded-full bg-white transition-colors"
          data-active={settings.data[settingsKey]}
        />
      </div>
    </div>
  )
}

export default function SettingsContent() {
  const t = useTranslations()
  const locale = useLocale()
  const settings = useSettings()

  const handleCookSpeedChange = (newSpeed: number) => {
    settings.setData('cookSpeed', newSpeed)
  }

  return (
    <div className="tablet:pt-tablet-y-padding pc:pt-pc-y-padding pt-mobile-y-padding grow">
      <div className="flex flex-col gap-32">
        <div className="text-48 text-primary-light font-bold">{t('settings')}</div>
        <div className="flex flex-col gap-56">
          <div className="flex flex-col gap-8">
            <div className="text-18 text-primary font-bold">Language</div>
            <div className="tablet:max-w-[480px] flex w-full flex-col gap-8">
              {LocaleOptions.map(([lang, name]) => (
                <a
                  href={`/${lang}/settings`}
                  key={lang}
                  className="rounded-8 border-primary-light bg-primary-background flex grow cursor-pointer items-center justify-between gap-8 px-12 py-8 data-[active=true]:border-2"
                  data-active={locale === lang}
                >
                  <div className="text-14 font-medium text-black">{name}</div>
                  <Icon.RightChevron className="text-gray size-16 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="text-18 text-primary font-bold">{t('recipeBook')}</div>
            <div className="flex flex-col gap-4">
              <SettingsToggleOption
                settingsKey="displayActionTime"
                label={t('displayActionTime')}
              />
              <SettingsToggleOption
                settingsKey="displayAlternative"
                label={t('displayAlternative')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="text-18 text-primary font-bold">{t('sandbox')}</div>
            <div className="flex flex-col gap-4">
              <SettingsToggleOption settingsKey="displayMenuList" label={t('displayMenuList')} />
              <SettingsToggleOption settingsKey="displayHint" label={t('displayHint')} />
              <div className="flex max-w-[480px] cursor-pointer justify-between gap-4">
                <div className="text-18 font-medium text-black">{t('cookSpeed')}</div>
                <div className="flex items-center gap-8">
                  {[1, 2, 10].map((speed) => (
                    <div
                      key={speed}
                      className="rounded-8 border-primary-light bg-primary-background flex cursor-pointer items-center justify-between gap-8 px-12 py-8 data-[active=true]:border-2"
                      data-active={settings.data.cookSpeed === speed}
                      onClick={() => handleCookSpeedChange(speed)}
                    >
                      <div className="text-14 font-medium text-black">x{speed}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <a
            href="https://github.com/delta-kor/ow-restaurant"
            target="_blank"
            className="flex items-center gap-6"
          >
            <Icon.Github className="text-gray size-20" />
            <div className="text-gray text-16 font-semibold">delta-kor/ow-restaurant</div>
          </a>
        </div>
      </div>
    </div>
  )
}
