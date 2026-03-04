import { TIMELINE_STEPS } from "@/lib/constants";

export default function Timeline() {
  return (
    <section id="timeline" className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          선발 일정
        </h2>
        <p className="mb-12 text-center text-gray-500">
          신청부터 인턴 시작까지의 전체 일정
        </p>

        {/* 가로 스크롤 타임라인 */}
        <div className="-mx-4 overflow-x-auto px-4 pb-4 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="relative flex min-w-max gap-0 md:min-w-0 md:grid md:grid-cols-6">
            {/* 연결선 */}
            <div className="pointer-events-none absolute left-8 right-8 top-5 hidden h-0.5 bg-primary-200 md:block" />

            {TIMELINE_STEPS.map((step, idx) => (
              <div key={step.label} className="relative flex w-40 shrink-0 flex-col items-center text-center md:w-auto">
                {/* 원형 순번 */}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step.status === "active"
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-primary-300 bg-white text-primary-400"
                  }`}
                >
                  <span className="text-sm font-bold">{idx + 1}</span>
                </div>

                {/* 모바일 연결선 */}
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div className="absolute left-[calc(50%+20px)] top-5 h-0.5 w-[calc(100%-40px)] bg-primary-200 md:hidden" />
                )}

                {/* 내용 */}
                <div className="mt-4">
                  <p className="break-keep text-sm font-bold text-primary-900">
                    {step.label}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-xs text-gray-500">
                    {step.date}
                  </p>
                  {step.detail && (
                    <p className="mt-0.5 break-keep text-xs text-gray-400">
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
