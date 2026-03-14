"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PROGRAM } from "@/lib/constants";
import { isApplicationOpen } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const open = isApplicationOpen();
  const [applicantCount, setApplicantCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats/count")
      .then((res) => res.json())
      .then((data) => setApplicantCount(data.count))
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-primary-900 py-24 text-white md:py-36">
      {/* 배경 이미지 */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover opacity-20"
        priority
        sizes="100vw"
      />
      {/* 그라데이션 오버레이 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-700/60" />
      {/* 플로팅 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 animate-[float_8s_ease-in-out_infinite] rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 animate-[float_10s_ease-in-out_infinite_1s] rounded-full bg-white/5" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 animate-[float_7s_ease-in-out_infinite_0.5s] rounded-full bg-accent/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        {/* 기관 배지 */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-base backdrop-blur-sm md:text-lg">
          <span className="font-medium">{PROGRAM.organizer}</span>
          <span className="text-white/60">|</span>
          <span>{PROGRAM.project}</span>
        </div>

        {/* 결과형 제목 */}
        <h1 className="mb-6 break-keep text-4xl font-bold leading-tight md:text-6xl lg:text-7xl md:leading-tight">
          서울 청년 구직자를 위한<br />
          글로벌 이커머스 취업 실무 과정
        </h1>

        {/* 여정 요약 서브카피 */}
        <p className="mx-auto mb-4 max-w-2xl break-keep text-xl text-white/80 md:text-2xl">
          350시간 실무교육 → 포트폴리오 완성 → 유급 인턴 연계
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/60 md:text-xl">
          수당 지급 · 교육비 전액 무료
        </p>

        {/* 대상 + 혜택 배지 */}
        <div className="mb-10 flex flex-wrap justify-center gap-3 md:gap-4">
          <span className="rounded-full bg-accent px-5 py-2.5 text-base font-semibold text-primary-950 md:text-lg">
            만 18~39세 서울 거주
          </span>
          <span className="rounded-full bg-white/15 px-5 py-2.5 text-base font-semibold backdrop-blur-sm md:text-lg">
            교육비 0원 + 수당 지급
          </span>
          <span className="rounded-full bg-white/15 px-5 py-2.5 text-base font-semibold backdrop-blur-sm md:text-lg">
            수료 후 유급 인턴 연계
          </span>
        </div>

        {/* 긴급성 + CTA */}
        {open ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-base font-medium text-white/90 md:text-lg">
              <span className="text-accent">{PROGRAM.capacity}명</span> 소수 선발 · {PROGRAM.deadline} 마감
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-light px-10 py-5 text-xl font-bold text-primary-950 shadow-lg transition-all hover:shadow-xl hover:brightness-110"
            >
              지금 신청하기
              <ArrowRight className="h-6 w-6" />
            </a>
            <p className="text-sm text-white/50">
              간편 신청 후 이메일로 신청서를 안내드립니다
            </p>
            {applicantCount !== null && applicantCount > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
                현재 {applicantCount}명 신청 완료
              </span>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-xl bg-gray-300 px-10 py-5 text-xl font-bold text-gray-500">
            모집이 마감되었습니다
          </span>
        )}
      </div>
    </section>
  );
}
