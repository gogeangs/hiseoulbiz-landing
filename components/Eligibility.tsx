"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BONUS_TARGETS } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2, AlertCircle, ChevronDown, Star } from "lucide-react";

const RECOMMENDATIONS = [
  "글로벌 이커머스·세일즈 분야 취업을 준비 중인 분",
  "실무 프로젝트와 포트폴리오가 필요한 분",
  "평일 전일제 교육 참여가 가능한 분",
];

const REQUIREMENTS = [
  "만 18세 이상 ~ 만 39세 이하",
  "서울시 거주 구직자 (졸업 예정자 가능, 재학생 불가)",
  "전 과정 개인 노트북 지참 필요",
];

export default function Eligibility() {
  const [bonusOpen, setBonusOpen] = useState(false);
  const { ref, visible } = useScrollReveal(0.1);
  const bonusRef = useRef<HTMLDivElement>(null);
  const [bonusHeight, setBonusHeight] = useState(0);

  const measure = useCallback(() => {
    if (bonusRef.current) setBonusHeight(bonusRef.current.scrollHeight);
  }, []);

  useEffect(() => {
    measure();
  }, [bonusOpen, measure]);

  return (
    <section id="eligibility" className="py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          지원 자격
        </h2>
        <p className={`mb-12 text-center text-gray-500 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          나에게 맞는 과정인지 확인해 보세요
        </p>

        <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">
          {/* 추천 대상 */}
          <div
            className={`rounded-2xl border border-green-100 bg-green-50/50 p-6 transition-all duration-700 delay-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              이런 분께 추천합니다
            </h3>
            <ul className="space-y-3">
              {RECOMMENDATIONS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <p className="break-keep text-gray-700">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* 확인 사항 */}
          <div
            className={`rounded-2xl border border-amber-100 bg-amber-50/50 p-6 transition-all duration-700 delay-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-amber-700">
              <AlertCircle className="h-5 w-5" />
              지원 전 꼭 확인하세요
            </h3>
            <ul className="space-y-3">
              {REQUIREMENTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="break-keep text-gray-700">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 가점 대상 아코디언 */}
        <div className="mx-auto mt-6 max-w-4xl">
          <button
            onClick={() => setBonusOpen(!bonusOpen)}
            aria-expanded={bonusOpen}
            aria-controls="bonus-targets-panel"
            className="flex w-full items-center justify-between rounded-xl border border-primary-100 bg-primary-50 p-4 text-left transition-colors hover:bg-primary-100"
          >
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="font-medium text-primary-800">
                가점 대상 확인하기
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-primary-600 transition-transform duration-300 ${
                bonusOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            id="bonus-targets-panel"
            role="region"
            className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
            style={{
              maxHeight: bonusOpen ? bonusHeight : 0,
              opacity: bonusOpen ? 1 : 0,
            }}
          >
            <div ref={bonusRef} className="mt-2 rounded-xl border border-primary-100 bg-primary-50/50 p-5">
              <p className="mb-3 text-sm font-medium text-primary-800">
                아래 해당자는 선발 시 가점이 부여됩니다.
              </p>
              <ul className="space-y-2">
                {BONUS_TARGETS.map((target) => (
                  <li
                    key={target}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    {target}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
