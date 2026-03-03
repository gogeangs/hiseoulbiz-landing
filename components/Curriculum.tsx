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
        <p className="mb-12 text-center text-gray-600">
          총 {PROGRAM.totalHours}시간, 현직자 중심 실무 교육
        </p>

        <div className="mx-auto max-w-3xl space-y-4">
          {CURRICULUM.map((item, idx) => (
            <div key={item.title} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary-900">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  )}
                </div>
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  {item.hours}H
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${barColors[idx]} transition-all`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
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
