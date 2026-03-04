import { CURRICULUM, PROGRAM } from "@/lib/constants";

const barColors = [
  "bg-primary-700",
  "bg-primary-600",
  "bg-primary-500",
  "bg-primary-400",
  "bg-primary-300",
  "bg-primary-200",
];

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

        <div className="mx-auto max-w-3xl space-y-4">
          {CURRICULUM.map((item, idx) => (
            <div
              key={item.title}
              className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              {/* 비중 표시 */}
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${barColors[idx]} text-white`}>
                <span className="text-lg font-bold">{item.percentage}%</span>
              </div>

              {/* 강의 정보 */}
              <div className="min-w-0 flex-1">
                <p className="break-keep text-lg font-bold text-primary-900">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="mt-0.5 break-keep text-sm text-gray-500">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* 시간 */}
              <span className="shrink-0 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700">
                {item.hours}H
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
