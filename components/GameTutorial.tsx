export default function GameTutorial() {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="text-14 text-gray flex items-center gap-4 font-semibold">
        <span className="bg-primary-background rounded-4 text-12 px-4 py-2">마우스 우클릭</span>{' '}
        또는 아이템을 들고{' '}
        <span className="bg-primary-background rounded-4 text-12 px-4 py-2">V</span>를 눌러 아이템
        던지기 (뭉치기)
      </div>
      <div className="text-14 text-gray flex items-center gap-4 font-semibold">
        <span className="bg-primary-background rounded-4 text-12 px-4 py-2">F</span>를 눌러 도마 위
        아이템 썰기
      </div>
    </div>
  )
}
