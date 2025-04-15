import MenuItemList from '@/components/MenuItemList'
import { Item } from '@/lib/restaurant/item'
import { FlowLine } from '@/lib/restaurant/solution'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export interface StagePageExecuteResult {
  menuFlowLineInfos: MenuFlowLineInfo[]
  hazardMenuFlowLineInfos: MenuFlowLineInfo[]
}

export interface MenuFlowLineInfo {
  item: Item
  flowLines: FlowLine[]
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stageId: string; lang: string }>
}) {
  const { stageId: stageIdText, lang } = await params
  setRequestLocale(lang)

  const stageId = parseInt(stageIdText)

  if (isNaN(stageId)) {
    notFound()
  }

  return <MenuItemList stageId={stageId} />
}
