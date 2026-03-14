"use client";

import { isApplicationOpen } from "@/lib/utils";
import { PROGRAM } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, GraduationCap, Wallet, Briefcase } from "lucide-react";

const HIGHLIGHTS = [
  { icon: GraduationCap, text: "교육비 전액 무료" },
  { icon: Wallet, text: `교육 수당 일 ${PROGRAM.dailyAllowance}원` },
  { icon: Briefcase, text: "수료 후 유급 인턴 연계" },
];

export default function FinalCTA() {
  const open = isApplicationOpen();
  const { ref, visible } = useScrollReveal(0.1);

  if (!open) return null;

  return (
    <section className="bg-primary-50 py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2
          className={`mb-4 text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          아직 고민 중이신가요?
        </h2>
        <p
          className={`mb-8 text-gray-500 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          3가지 정보만 입력하면 바로 신청 완료, 부담 없이 시작하세요
        </p>

        <div
          className={`mb-10 flex flex-wrap justify-center gap-4 transition-all duration-700 delay-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 shadow-sm"
              >
                <Icon className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-semibold text-primary-800">{item.text}</span>
              </div>
            );
          })}
        </div>

        <a
          href="#apply"
          className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 px-10 py-5 text-xl font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 duration-700 delay-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          지금 바로 신청하기
          <ArrowRight className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
}
