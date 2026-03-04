"use client";

import { TIMELINE_STEPS } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Timeline() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="timeline" className="bg-gray-50 py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          선발 일정
        </h2>
        <p className={`mb-12 text-center text-gray-500 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          신청부터 인턴 시작까지의 전체 일정
        </p>

        {/* 가로 스크롤 타임라인 + 스크롤 힌트 */}
        <div className="relative md:static">
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent md:hidden" />
          <div className="-mx-4 overflow-x-auto px-4 pb-4 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <div className="relative flex min-w-max gap-0 md:min-w-0 md:grid md:grid-cols-6">
              {/* 연결선 */}
              <div className="pointer-events-none absolute left-8 right-8 top-5 hidden h-0.5 bg-primary-200 md:block" />

              {TIMELINE_STEPS.map((step, idx) => (
                <div
                  key={step.label}
                  className={`relative flex w-40 shrink-0 flex-col items-center text-center md:w-auto transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  style={{ transitionDelay: `${200 + idx * 150}ms` }}
                >
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
      </div>
    </section>
  );
}
