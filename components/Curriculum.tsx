"use client";

import { CURRICULUM, PROGRAM } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Curriculum() {
  const { ref, visible } = useScrollReveal(0.1);

  // 연속된 같은 phase를 그룹 경계로 판별
  let prevPhase = "";

  return (
    <section id="curriculum" className="bg-gray-50 py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          커리큘럼
        </h2>
        <p className={`mb-12 text-center text-gray-500 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          실무 이해에서 취업까지, {PROGRAM.totalHours}시간의 여정
        </p>

        {/* 가로 스크롤 카드 + 스크롤 힌트 */}
        <div className="relative md:static">
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent md:hidden" />
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
            {CURRICULUM.map((item, idx) => {
              const showPhase = item.phase !== prevPhase;
              prevPhase = item.phase;

              return (
                <div
                  key={item.title}
                  className={`flex w-64 shrink-0 snap-start flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:w-auto transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  style={{ transitionDelay: `${200 + idx * 100}ms` }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
                      {idx + 1}
                    </span>
                    {showPhase && (
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                        {item.phase}
                      </span>
                    )}
                  </div>
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
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          ※ 세부 커리큘럼은 변경될 수 있습니다.
        </p>
      </div>
    </section>
  );
}
