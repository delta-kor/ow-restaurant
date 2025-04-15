import Icon from '@/components/Icon'
import { Link } from '@/i18n/routing'

export default function MainPage() {
  return (
    <div className="tablet:pt-0 tablet:h-dvh flex grow items-center pt-24">
      <div className="flex grow items-center justify-between">
        <div className="tablet:shrink-0 flex grow flex-col gap-56">
          <div className="flex flex-col">
            <div className="text-primary text-32 tablet:text-48 font-bold">OW-RESTAURANT</div>
            <div className="text-gray text-18 tablet:text-24 font-semibold">
              Overwatch2 Restaurant Workshop Recipe Book
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="text-gray text-16 font-bold">워크샵 코드</div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-12">
                <div className="text-primary-light text-18 w-72 font-semibold">한국어</div>
                <div className="text-primary text-18 w-64 font-bold">SPXXM</div>
                <Icon.Copy className="text-primary-light size-20" />
              </div>
              <div className="flex items-center gap-12">
                <div className="text-primary-light text-18 w-72 font-semibold">English</div>
                <div className="text-primary text-18 w-64 font-bold">HTNZ3</div>
                <Icon.Copy className="text-primary-light size-20" />
              </div>
              <div className="flex items-center gap-12">
                <div className="text-primary-light text-18 w-72 font-semibold">日本語</div>
                <div className="text-primary text-18 w-64 font-bold">4ND1P</div>
                <Icon.Copy className="text-primary-light size-20" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-16 self-stretch">
            <div className="flex basis-0 items-center gap-16 self-stretch">
              <Link
                href={'/book'}
                className="rounded-16 border-light-gray tablet:grow-0 flex grow items-center gap-12 border-2 px-24 py-16"
              >
                <Icon.Book className="text-primary size-24 shrink-0" />
                <div className="text-gray text-20 grow font-bold">레시피북</div>
                <Icon.RightChevron className="text-gray size-20 shrink-0" />
              </Link>

              <Link
                href={'/sandbox'}
                className="rounded-16 border-light-gray tablet:grow-0 flex grow items-center gap-12 border-2 px-24 py-16"
              >
                <Icon.Game className="text-primary size-24 shrink-0" />
                <div className="text-gray text-20 grow font-bold">샌드박스</div>
                <Icon.RightChevron className="text-gray size-20 shrink-0" />
              </Link>
            </div>

            <div className="flex items-center gap-8">
              <Icon.Discord className="text-light-gray-hover size-20 shrink-0" />
              <div className="text-light-gray-hover text-16 font-bold">공식 디스코드</div>
              <Icon.RightChevron className="text-light-gray-hover size-20 shrink-0" />
            </div>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pc:block hidden size-[280px]"
          viewBox="0 0 178 178"
          fill="none"
        >
          <path
            d="M88.0222 0.00126552C68.2149 0.12823 48.6333 7.18904 33.2488 19.606L50.0584 39.1224C64.2454 27.9265 83.3609 23.364 101.09 26.8887C110.834 28.7632 120.105 33.0415 127.928 39.1224L144.738 19.606C128.825 6.76529 108.511 -0.305761 88.0222 0.00126552Z"
            fill="#EFF3FF"
          />
          <path
            d="M27.7763 24.4017C10.0641 41.0416 -0.321051 65.2303 0.00757214 89.6297C0.0180741 114.956 11.5712 139.835 30.7577 156.29C48.4927 171.801 72.6131 179.702 96.1612 177.703C121.678 175.803 145.897 162.174 160.869 141.468C175.443 121.79 181.153 95.8411 176.315 71.7779C172.759 53.3575 163.101 36.2862 149.367 23.5975L132.557 43.1139C146.101 55.8808 153.497 74.7259 152.103 93.3172C151.493 102.528 148.818 111.619 144.296 119.709L110.039 86.6189L92.7557 49.3627L92.7297 105.782L127.349 139.284C111.922 151.27 90.7546 155.245 71.9979 149.932C64.3605 147.802 57.1284 144.227 50.8429 139.431L85.6979 105.782C85.6371 87.4391 85.9107 67.6378 85.6977 49.3021L68.3881 86.6189L33.8372 119.983C23.2965 101.582 23.0443 77.794 33.1899 59.188C36.3616 53.2274 40.5594 47.7877 45.4293 43.1139L28.6197 23.5975C28.3386 23.8656 28.0574 24.1336 27.7763 24.4017Z"
            fill="#EFF3FF"
          />
        </svg>
      </div>
    </div>
  )
}
