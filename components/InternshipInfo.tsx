"use client";

import Image from "next/image";
import Link from "next/link";
import { PROGRAM } from "@/lib/constants";
import { APPLY_URL, isApplicationOpen } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  BadgeCheck,
  FileText,
  FolderOpen,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";

export default function InternshipInfo() {
  const open = isApplicationOpen();
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="internship" className="relative overflow-hidden bg-primary-900 py-16 text-white md:py-20" ref={ref}>
      <Image
        src="/images/internship-bg.jpg"
        alt=""
        fill
        className="object-cover opacity-15"
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-900/60 via-primary-900/40 to-primary-900/80" />
      <div className="relative mx-auto max-w-6xl px-4">
        <h2 className={`mb-4 text-center text-2xl font-bold md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          수료 후 바로 이어지는 유급 인턴십
        </h2>
        <p className={`mb-12 text-center text-white/70 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          80% 이상 출석한 우수 수료자 대상
        </p>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className={`rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all duration-700 delay-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <p className="mb-1 text-sm text-white/70">인턴 기간</p>
            <p className="whitespace-nowrap text-xl font-bold md:text-2xl">
              {PROGRAM.internStart} ~ {PROGRAM.internEnd}
            </p>
            <p className="mt-1 text-sm text-white/70">{PROGRAM.internMonths}개월</p>
          </div>
          <div className={`rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all duration-700 delay-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <p className="mb-1 text-sm text-white/70">월 급여 (세전)</p>
            <p className="whitespace-nowrap text-xl font-bold md:text-2xl">
              {PROGRAM.internSalary}원
            </p>
            <p className="mt-1 text-sm text-white/70">× {PROGRAM.internMonths}개월</p>
          </div>
          <div className={`rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all duration-700 delay-[400ms] ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <p className="mb-1 text-sm text-white/70">추가 수당</p>
            <p className="break-keep text-xl font-bold md:text-2xl">
              연차휴가 미사용
            </p>
            <p className="mt-1 text-sm text-white/70">수당 별도 지급</p>
          </div>
        </div>

        <div className={`mx-auto max-w-3xl rounded-2xl border border-accent/30 bg-accent/10 p-8 backdrop-blur-sm transition-all duration-700 delay-500 ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"}`}>
          <h3 className="mb-6 text-center text-xl font-bold text-accent">
            취업 연계 지원
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-xl bg-white/10 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="break-keep font-semibold">이력서·자기소개서 1:1 첨삭</p>
                <p className="mt-1 break-keep text-sm text-white/60">전문가의 맞춤형 피드백</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white/10 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <FolderOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="break-keep font-semibold">프로젝트 기반 포트폴리오 완성</p>
                <p className="mt-1 break-keep text-sm text-white/60">실무 역량을 증명하는 결과물</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white/10 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <HeadphonesIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="break-keep font-semibold">전담 퍼실리테이터 취업 상담</p>
                <p className="mt-1 break-keep text-sm text-white/60">교육 기간 내 지속적 지원</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white/10 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <BadgeCheck className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="break-keep font-semibold">유급 인턴 및 취업 연계</p>
                <p className="mt-1 break-keep text-sm text-white/60">수료 후 실무 경험 기회 제공</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          {open ? (
            <Link
              href={APPLY_URL}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-primary-950 transition-colors hover:bg-yellow-400"
            >
              지금 신청하기
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl bg-gray-500 px-8 py-4 text-lg font-bold text-gray-300">
              모집이 마감되었습니다
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
