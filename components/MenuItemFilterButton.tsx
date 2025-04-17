import { MenuItemType } from '@/components/MenuItem'
import { useTranslations } from 'next-intl'

export default function MenuItemFilterButton({
  active,
  onActiveChange,
  type,
}: {
  active: boolean
  onActiveChange: (active: boolean) => void
  type: MenuItemType
}) {
  const t = useTranslations()

  const handleClick = () => {
    onActiveChange(!active)
  }

  if (type === MenuItemType.AdditionalStageMenu) return null

  const text =
    type === MenuItemType.Menu
      ? t('mainMenu')
      : type === MenuItemType.HazardMenu
        ? t('sideMenu')
        : t('specialMenu')

  return (
    <div
      onClick={handleClick}
      className="rounded-8 bg-primary-background flex cursor-pointer items-center gap-8 px-12 py-6"
    >
      <div
        className="bg-light-gray-hover data-[active=true]:bg-primary size-8 rounded-full transition-colors"
        data-active={active}
      />
      <div className="text-gray text-14 font-semibold select-none">{text}</div>
    </div>
  )
}
