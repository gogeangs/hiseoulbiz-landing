import { PROGRAM } from "@/lib/constants";
import { UCANSIGN_URL, isApplicationOpen } from "@/lib/utils";
import {
  BadgeCheck,
  FileText,
  FolderOpen,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";

export default function InternshipInfo() {
  const open = isApplicationOpen();

  return (
    <section id="internship" className="bg-primary-900 py-16 text-white md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          수료 후 바로 이어지는 유급 인턴십
        </h2>
        <p className="mb-12 text-center text-white/70">
          80% 이상 출석한 우수 수료자 대상
        </p>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm">
            <p className="mb-1 text-sm text-white/70">인턴 기간</p>
            <p className="text-2xl font-bold">
              {PROGRAM.internStart} ~ {PROGRAM.internEnd}
            </p>
            <p className="mt-1 text-sm text-white/70">{PROGRAM.internMonths}개월</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm">
            <p className="mb-1 text-sm text-white/70">월 급여 (세전)</p>
            <p className="text-2xl font-bold">{PROGRAM.internSalary}원</p>
            <p className="mt-1 text-sm text-white/70">× {PROGRAM.internMonths}개월</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm">
            <p className="mb-1 text-sm text-white/70">추가 수당</p>
            <p className="text-2xl font-bold">연차휴가 미사용</p>
            <p className="mt-1 text-sm text-white/70">수당 별도 지급</p>
          </div>
        </div>

        <h3 className="mb-6 text-center text-xl font-semibold">
          취업 연계 지원
        </h3>
        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium">이력서·자기소개서 1:1 첨삭</p>
              <p className="text-sm text-white/60">전문가의 맞춤형 피드백</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
            <FolderOpen className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium">프로젝트 기반 포트폴리오 완성</p>
              <p className="text-sm text-white/60">실무 역량을 증명하는 결과물</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
            <HeadphonesIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium">전담 퍼실리테이터 취업 상담</p>
              <p className="text-sm text-white/60">교육 기간 내 지속적 지원</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium">유급 인턴 및 취업 연계</p>
              <p className="text-sm text-white/60">수료 후 실무 경험 기회 제공</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          {open ? (
            <a
              href={UCANSIGN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-primary-950 transition-colors hover:bg-yellow-400"
            >
              지금 신청하기
              <ArrowRight className="h-5 w-5" />
            </a>
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
