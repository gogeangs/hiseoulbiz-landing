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
          신청부터 인턴 시작까지 한눈에
        </p>

        {/* 데스크톱: 가로 타임라인 */}
        <div className="hidden md:block">
          <div className="relative mx-auto max-w-4xl">
            {/* 연결선 */}
            <div className="absolute left-[10%] right-[10%] top-8 h-0.5 bg-primary-200" />

            <div className="grid grid-cols-5">
              {TIMELINE_STEPS.map((step, idx) => (
                <div
                  key={step.label}
                  className={`relative flex flex-col items-center text-center transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  style={{ transitionDelay: `${200 + idx * 150}ms` }}
                >
                  {/* 날짜 원형 */}
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                      step.status === "active"
                        ? "border-accent bg-accent text-primary-950 shadow-lg shadow-accent/30"
                        : "border-primary-200 bg-white text-primary-700"
                    }`}
                  >
                    <span className="text-lg font-bold leading-tight">{step.dateShort}</span>
                    {step.status === "active" && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="mt-4">
                    <p className={`text-sm font-bold ${step.status === "active" ? "text-accent-dark" : "text-primary-900"}`}>
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
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

        {/* 모바일: 세로 타임라인 */}
        <div className="md:hidden">
          <div className="relative mx-auto max-w-sm pl-10">
            {/* 세로 연결선 */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-primary-200" />

            <div className="space-y-6">
              {TIMELINE_STEPS.map((step, idx) => (
                <div
                  key={step.label}
                  className={`relative flex items-start gap-4 transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}
                  style={{ transitionDelay: `${200 + idx * 120}ms` }}
                >
                  {/* 원형 노드 */}
                  <div
                    className={`absolute -left-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.status === "active"
                        ? "border-accent bg-accent text-primary-950 shadow-md shadow-accent/30"
                        : "border-primary-200 bg-white text-primary-600"
                    }`}
                  >
                    <span className="text-xs font-bold">{step.dateShort}</span>
                  </div>

                  {/* 내용 카드 */}
                  <div className={`rounded-xl border p-4 ${
                    step.status === "active"
                      ? "border-accent/30 bg-accent/5"
                      : "border-gray-100 bg-white"
                  }`}>
                    <p className={`font-bold ${step.status === "active" ? "text-accent-dark" : "text-primary-900"}`}>
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">{step.date}</p>
                    {step.detail && (
                      <p className="mt-0.5 break-keep text-xs text-gray-400">{step.detail}</p>
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
