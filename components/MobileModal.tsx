'use client'

import { useState } from 'react'

export default function MobileModal() {
  const [isModalClosed, setIsModalClosed] = useState(false)

  if (isModalClosed) return null

  return (
    <div className="tablet:hidden bg-gray/30 fixed inset-0 bottom-[80px] z-10 flex w-dvw items-center justify-center p-16">
      <div className="rounded-16 flex flex-col gap-2 bg-white p-16">
        <div className="text-18 font-semibold text-black">
          모바일 환경에서는 샌드박스를 사용 할 수 없습니다.
        </div>
        <div className="text-gray text-16 font-medium">
          키보드와 마우스를 사용하는 PC 브라우저를 이용해 주시기 바랍니다.
        </div>
        <div
          className="text-primary-light text-16 mt-16 self-stretch font-medium underline"
          onClick={() => setIsModalClosed(true)}
        >
          무시하기
        </div>
      </div>
    </div>
  )
}
