"use client";

import { Monitor, Building2, FolderOpen, FileCheck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const outcomes = [
  {
    icon: Monitor,
    title: "이커머스 실무를 설명할 수 있게 됩니다",
    description: "쇼피파이·아마존 상품 등록부터 광고 세팅, 성과 분석까지 직접 해본 경험이 생깁니다.",
  },
  {
    icon: FolderOpen,
    title: "포트폴리오가 완성됩니다",
    description: "팀·개인 프로젝트 결과물을 정리해 면접에서 바로 보여줄 수 있는 포트폴리오가 됩니다.",
  },
  {
    icon: Building2,
    title: "실제 기업에서 일하게 됩니다",
    description: "우수 수료자는 3개월 유급 인턴으로 실무 경험과 경력을 동시에 쌓습니다.",
  },
  {
    icon: FileCheck,
    title: "서류·면접 준비까지 연결됩니다",
    description: "이력서·자소서 1:1 첨삭과 모의 면접으로 취업 준비의 마지막 단계까지 함께합니다.",
  },
];

export default function Outcomes() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section className="bg-gray-50 py-16 md:py-20" ref={ref}>
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
          수료 후 내 손에 남는 것들
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-700 hover:border-primary-200 hover:shadow-md ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${200 + idx * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="mb-2 break-keep text-base font-bold leading-snug text-primary-900">{item.title}</h3>
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
