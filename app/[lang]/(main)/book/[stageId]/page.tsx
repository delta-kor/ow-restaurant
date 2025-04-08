import BookTemplate from '@/components/template/BookTemplate'
import { notFound } from 'next/navigation'

export default async function StagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId: stageIdText } = await params
  const stageId = parseInt(stageIdText)

  if (isNaN(stageId)) {
    notFound()
  }

  return <BookTemplate stageId={stageId} />
}

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({
    stageId: i.toString(),
  }))
}
