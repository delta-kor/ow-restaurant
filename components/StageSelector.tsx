'use client'

import Icon from '@/components/Icon'
import { Link } from '@/i18n/routing'
import { CustomRestaurantInfos, FormUrl, getCustomRestaurantInfo } from '@/lib/restaurant/custom'
import { getRecipe } from '@/lib/restaurant/restaurant'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export const StageIconMap = [
  Icon.Steak,
  Icon.Burger,
  Icon.Chicken,
  Icon.Pizza,
  Icon.Dumpling,
  Icon.Egg,
  Icon.Fish,
  Icon.Noodles,
  Icon.Taco,
  Icon.Icecream,
  Icon.Pancake,
  Icon.Meat,
]

export default function StageSelector() {
  const t = useTranslations()
  const locale = useLocale()

  const [modalActive, setModalActive] = useState(false)

  const params = useParams<{ bookPath: string[] }>()
  const { bookPath } = params

  if (bookPath.length !== 1 && bookPath.length !== 2) return null

  let stageIdText: string
  switch (bookPath.length) {
    case 1:
      stageIdText = bookPath[0]
      break
    case 2:
      stageIdText = bookPath[1]
      break
  }

  const recipeId = bookPath.length === 1 ? null : bookPath[0]
  const stageId = parseInt(stageIdText) || 0

  const stages = getRecipe(recipeId).stages
  const customRestaurantInfo = getCustomRestaurantInfo(recipeId)

  const handleCustomRestaurantClick = () => {
    setModalActive(true)
  }

  const handleModalClose = () => {
    setModalActive(false)
  }

  const handleCustomRestaurantSelect = () => {
    setModalActive(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-8">
        <div className="text-gray text-16 font-bold">{t('stage')}</div>
        <div
          className="text-primary text-12 bg-primary-background rounded-8 flex cursor-pointer items-center px-12 py-6 font-bold"
          onClick={handleCustomRestaurantClick}
        >
          <div>{t('customRestaurant')}</div>
          {customRestaurantInfo && (
            <div className="text-12 rounded-4 -my-2 mr-4 ml-6 bg-black/80 px-6 py-2 font-normal text-white">
              {customRestaurantInfo.name}
            </div>
          )}
          <Icon.RightChevron className="size-16" />
        </div>
      </div>
      <div className="flex flex-wrap gap-8">
        {stages.map((stage) => {
          const IconComponent = StageIconMap[stage.id]
          return (
            <Link
              key={stage.id}
              href={recipeId === null ? `/book/${stage.id}` : `/book/${recipeId}/${stage.id}`}
              data-active={stageId === stage.id}
              className="rounded-8 group data-[active=true]:bg-primary bg-primary-background flex items-center gap-4 px-12 py-6 transition-colors"
            >
              {recipeId === null && (
                <IconComponent className="text-primary size-16 shrink-0 transition-colors group-data-[active=true]:text-white" />
              )}
              <div className="text-14 text-primary font-semibold transition-colors group-data-[active=true]:text-white">
                {stage.getName(locale)}
              </div>
            </Link>
          )
        })}
      </div>
      <AnimatePresence>
        {modalActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          >
            <div className="rounded-8 relative mx-16 flex w-full max-w-[480px] flex-col gap-16 bg-white p-16">
              <div className="flex flex-col gap-2">
                <div className="text-16 text-gray font-bold">{t('selectRestaurant')}</div>
                <a
                  href={FormUrl}
                  target="_blank"
                  className="text-12 text-primary cursor-pointer underline underline-offset-2"
                >
                  {t('addCustomRestaurant')}
                </a>
              </div>
              <div className="flex flex-col">
                {[{ name: t('default'), code: null, recipeId: null }, ...CustomRestaurantInfos].map(
                  (info) => (
                    <Link
                      key={info.recipeId}
                      href={info.recipeId === null ? '/book/0' : `/book/${info.recipeId}/0`}
                      className="data-[active=true]:bg-primary-background rounded-8 text-14 flex cursor-pointer items-center justify-between px-16 py-8"
                      data-active={recipeId === info.recipeId}
                      onClick={handleCustomRestaurantSelect}
                    >
                      <div>{info.name}</div>
                      <div className="text-primary-light">{info.code}</div>
                    </Link>
                  )
                )}
              </div>
              <div
                className="absolute top-16 right-16 -m-8 cursor-pointer p-8"
                onClick={handleModalClose}
              >
                <Icon.Close className="text-primary-light size-16" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
