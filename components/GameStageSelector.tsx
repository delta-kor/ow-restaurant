import Icon from '@/components/Icon'
import { StageIconMap } from '@/components/StageSelector'
import { recipe } from '@/lib/restaurant/restaurant'
import { Stage } from '@/lib/restaurant/stage'
import { Effect } from 'effect'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale } from 'next-intl'
import { useState } from 'react'

export default function GameStageSelector({
  stageId,
  onStageSelect,
}: {
  stageId: number
  onStageSelect: (stageId: number) => void
}) {
  const locale = useLocale()
  const [isActive, setIsActive] = useState<boolean>(false)

  const handleClick = () => {
    const nextState = !isActive
    setIsActive(nextState)
    if (nextState) {
      document.addEventListener('click', handleClickOutside)
    }
  }

  const handleClickOutside = () => {
    setIsActive(false)
    document.removeEventListener('click', handleClickOutside)
  }

  const handleSelect = (stage: Stage) => {
    onStageSelect(stage.id)
  }

  const stage = recipe.getStage(stageId).pipe(Effect.runSync)
  const stages = recipe.stages

  return (
    <div className="relative mb-8 flex cursor-pointer items-center gap-4" onClick={handleClick}>
      <div className="text-gray text-16 font-semibold select-none">{stage.getName(locale)}</div>
      <Icon.DownChevron className="text-gray size-16" />
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-8 border-primary-background absolute right-0 -bottom-4 z-10 flex w-[156px] translate-y-full flex-col border-2 bg-white p-4"
          >
            {stages.map((stage) => {
              const IconComponent = StageIconMap[stage.id]
              return (
                <div
                  key={stage.id}
                  onClick={() => handleSelect(stage)}
                  className="hover:bg-primary-background rounded-4 flex min-w-0 basis-0 items-center gap-8 self-stretch px-8 py-4 transition-colors"
                >
                  <IconComponent className="text-gray size-14 shrink-0 opacity-70" />
                  <div className="text-14 text-gray w-full grow truncate font-medium select-none">
                    {stage.getName(locale)}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
