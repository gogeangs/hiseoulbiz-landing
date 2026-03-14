"use client";

import { GraduationCap, Briefcase, HeadphonesIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DIFFERENTIATORS = [
  {
    headline: "배우기만 하는 교육이 아닙니다",
    description: "현직자 중심 350시간 프로젝트형 실습으로 실무 역량을 쌓습니다",
    highlight: "350시간 실무 프로젝트",
    icon: GraduationCap,
  },
  {
    headline: "수료로 끝나지 않습니다",
    description: "우수 수료자 대상 3개월 유급 인턴(월 253만원)으로 실무 경험까지",
    highlight: "3개월 유급 인턴 연계",
    icon: Briefcase,
  },
  {
    headline: "취업 준비까지 함께 갑니다",
    description: "이력서·자소서 첨삭, 포트폴리오 완성, 1:1 취업 상담까지 지원",
    highlight: "취업 풀패키지 지원",
    icon: HeadphonesIcon,
  },
];

export default function Benefits() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="benefits" className="bg-gray-50 py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          이 과정이 특별한 이유
        </h2>
        <p className={`mb-12 text-center text-gray-500 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          일반 취업 교육과는 다릅니다
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {DIFFERENTIATORS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.headline}
                className={`relative overflow-hidden rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all duration-700 hover:shadow-lg hover:border-primary-200 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${200 + idx * 100}ms` }}
              >
                {/* 상단 그라데이션 라인 */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-accent" />
                {/* 배경 장식 아이콘 */}
                <div className="pointer-events-none absolute -right-4 -top-4 opacity-[0.04]">
                  <Icon className="h-32 w-32 text-primary-900" aria-hidden="true" />
                </div>
                <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                  <Icon className="h-7 w-7 text-primary-700" aria-hidden="true" />
                </div>
                <h3 className="mb-3 break-keep text-center text-lg font-bold text-primary-900">
                  {item.headline}
                </h3>
                <p className="mb-4 break-keep text-center text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
                <p className="text-center text-sm font-semibold text-accent">
                  {item.highlight}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
