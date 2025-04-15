'use client'

import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="flex flex-col gap-4 p-16">
      <div className="text-24 font-bold text-black">Error</div>
      <Link href="/" className="text-primary text-18 font-semibold underline">
        Main
      </Link>
    </div>
  )
}
