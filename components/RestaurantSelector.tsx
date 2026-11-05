'use client'
import { editionFor, editions, ThemeId, themeName } from '@/lib/restaurant/catalog'
import { useLocale, useTranslations } from 'next-intl'
import SelectMenu from './SelectMenu'

export default function RestaurantSelector({
  value,
  onChange,
}: {
  value: ThemeId
  onChange: (id: ThemeId) => void
}) {
  const t = useTranslations(),
    locale = useLocale(),
    edition = editionFor(value)
  return (
    <div className="flex flex-wrap items-end gap-12">
      <SelectMenu
        label={t('edition')}
        value={edition.id}
        options={editions.map((e) => ({ value: e.id, label: t(e.label) }))}
        onChange={(id) => onChange(editions.find((e) => e.id === id)!.themes[0])}
      />
      {edition.themes.length > 1 && (
        <SelectMenu
          label={t('restaurantTheme')}
          value={value}
          options={edition.themes.map((id) => ({ value: id, label: themeName(id, locale) }))}
          onChange={onChange}
        />
      )}
    </div>
  )
}
