import { CURRICULUM, PROGRAM } from "@/lib/constants";

export default function Curriculum() {
  return (
    <section id="curriculum" className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          커리큘럼
        </h2>
        <p className="mb-12 text-center text-gray-500">
          총 {PROGRAM.totalHours}시간, 현직자 중심 실무 교육
        </p>

        {/* 가로 스크롤 카드 */}
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {CURRICULUM.map((item, idx) => (
            <div
              key={item.title}
              className="flex w-64 shrink-0 snap-start flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:w-auto"
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
                {idx + 1}
              </span>
              <p className="mb-1 break-keep text-base font-bold text-primary-900">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="mb-3 break-keep text-sm text-gray-400">
                  {item.subtitle}
                </p>
              )}
              <span className="mt-auto text-sm font-medium text-primary-600">
                {item.hours}시간
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          ※ 세부 커리큘럼은 변경될 수 있습니다.
        </p>
      </div>
    </section>
  );
}
