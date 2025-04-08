import StageSelector from '@/components/StageSelector'

export default function BookTemplate({ stageId }: { stageId?: number }) {
  return (
    <div className="flex flex-col">
      <StageSelector selectedStageId={stageId || 0} />
    </div>
  )
}
