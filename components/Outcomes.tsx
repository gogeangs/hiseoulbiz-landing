"use client";

import { TrendingUp, Award, Building2, Globe } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const outcomes = [
  {
    icon: TrendingUp,
    title: "실무 역량 확보",
    description: "350시간 현직자 교육으로 이커머스 기획·운영·마케팅 실무 능력을 갖추게 됩니다.",
  },
  {
    icon: Building2,
    title: "유급 인턴 연계",
    description: "우수 수료자는 3개월 유급 인턴십(월 253만원)으로 실제 기업 현장을 경험합니다.",
  },
  {
    icon: Globe,
    title: "글로벌 커리어",
    description: "해외 이커머스 플랫폼 운영 역량으로 글로벌 취업 경쟁력을 확보합니다.",
  },
  {
    icon: Award,
    title: "취업 지원",
    description: "이력서·자기소개서 컨설팅, 모의 면접 등 체계적인 취업 지원을 받을 수 있습니다.",
  },
];

export default function Outcomes() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section className="bg-white py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2
          className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          수료 후 이런 변화가 기다립니다
        </h2>
        <p
          className={`mb-12 text-center text-gray-500 transition-all duration-700 delay-100 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          교육부터 취업까지, 단계별로 성장하는 커리어 로드맵
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center transition-all duration-700 hover:border-primary-200 hover:shadow-md ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${200 + idx * 100}ms` }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-primary-900">{item.title}</h3>
                <p className="break-keep text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
