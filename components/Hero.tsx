"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROGRAM } from "@/lib/constants";
import { APPLY_URL, isApplicationOpen } from "@/lib/utils";
import { ArrowRight, Users, CalendarClock } from "lucide-react";

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
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-base backdrop-blur-sm md:text-lg">
          <span className="font-medium">{PROGRAM.organizer}</span>
          <span className="text-white/60">|</span>
          <span>{PROGRAM.project}</span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl md:leading-tight">
          교육비 무료, 수당까지<br />
          이커머스 실무 과정
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80 md:text-2xl">
          350시간 현직자 실무 교육 + 일 2.5만원 수당
          <br className="hidden sm:block" />
          수료 후 월 253만원 유급 인턴십 연계
        </p>

        <div className="mb-10 flex flex-wrap justify-center gap-3 md:gap-4">
          <span className="rounded-full bg-accent px-5 py-2.5 text-base font-semibold text-primary-950 md:text-lg">
            교육비 전액 무료
          </span>
          <span className="rounded-full bg-white/15 px-5 py-2.5 text-base font-semibold backdrop-blur-sm md:text-lg">
            일 25,000원 수당
          </span>
          <span className="rounded-full bg-white/15 px-5 py-2.5 text-base font-semibold backdrop-blur-sm md:text-lg">
            3개월 유급 인턴
          </span>
        </div>

        {open ? (
          <Link
            href={APPLY_URL}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-xl font-bold text-primary-800 shadow-lg transition-all hover:bg-primary-50 hover:shadow-xl"
          >
            지금 신청하기
            <ArrowRight className="h-6 w-6" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-xl bg-gray-300 px-10 py-5 text-xl font-bold text-gray-500">
            모집이 마감되었습니다
          </span>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-base text-white/70 md:text-lg">
          <span className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            신청 마감: {PROGRAM.deadline}
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            선발 인원: {PROGRAM.capacity}명
          </span>
          {applicantCount !== null && applicantCount > 0 && (
            <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-medium text-accent backdrop-blur-sm">
              현재 {applicantCount}명 신청 완료
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
