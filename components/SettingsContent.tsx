'use client'

import Icon from '@/components/Icon'
import { SettingsKey, useSettings } from '@/providers/Settings'
import { useLocale } from 'next-intl'

const LocaleOptions = [
  ['ko', '한국어'],
  ['en', 'English'],
  ['ja', '日本語'],
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
      <div
        className="bg-light-gray data-[active=true]:bg-primary size-16 rounded-full transition-colors"
        data-active={settings.data[settingsKey]}
      />
    </div>
  )
}

export default function SettingsContent() {
  const locale = useLocale()
  const settings = useSettings()

  const handleCookSpeedChange = (newSpeed: number) => {
    settings.setData('cookSpeed', newSpeed)
  }

  return (
    <div className="tablet:pt-tablet-y-padding pc:pt-pc-y-padding pt-mobile-y-padding grow">
      <div className="flex flex-col gap-32">
        <div className="text-48 text-primary-light font-bold">설정</div>
        <div className="flex flex-col gap-56">
          <div className="flex flex-col gap-8">
            <div className="text-18 text-primary font-bold">언어</div>
            <div className="flex items-center gap-16">
              {LocaleOptions.map(([lang, name]) => (
                <a
                  href={`/${lang}/settings`}
                  key={lang}
                  className="rounded-8 border-primary-light bg-primary-background flex w-128 cursor-pointer items-center justify-between gap-8 px-12 py-8 data-[active=true]:border-2"
                  data-active={locale === lang}
                >
                  <div className="text-14 font-medium text-black">{name}</div>
                  <Icon.RightChevron className="text-gray size-16" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="text-18 text-primary font-bold">레시피북</div>
            <div className="flex flex-col gap-4">
              <SettingsToggleOption settingsKey="displayActionTime" label="조리 시간 표시" />
              <SettingsToggleOption settingsKey="displayAlternative" label="대안 표시" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="text-18 text-primary font-bold">샌드박스</div>
            <div className="flex flex-col gap-4">
              <SettingsToggleOption settingsKey="displayMenuList" label="메뉴 목록 표시" />
              <SettingsToggleOption settingsKey="displayHint" label="힌트 표시" />
              <div className="flex max-w-[480px] cursor-pointer flex-col gap-4">
                <div className="text-18 font-medium text-black">조리 속도</div>
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
        </div>
      </div>
    </div>
  )
}
