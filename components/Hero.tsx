import { PROGRAM } from "@/lib/constants";
import { UCANSIGN_URL, isApplicationOpen } from "@/lib/utils";
import { ArrowRight, Users, CalendarClock } from "lucide-react";

export default function Hero() {
  const open = isApplicationOpen();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-24 text-white md:py-36">
      {/* 청년 일러스트 배경 */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center opacity-[0.08]">
        <svg
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-5xl"
        >
          {/* 인물 1 - 노트북 들고 있는 여성 */}
          <g transform="translate(80, 40)">
            <circle cx="40" cy="30" r="28" fill="white" />
            <rect x="20" y="58" width="40" height="55" rx="12" fill="white" />
            <rect x="8" y="65" width="14" height="40" rx="7" fill="white" transform="rotate(-15 8 65)" />
            <rect x="58" y="65" width="14" height="40" rx="7" fill="white" transform="rotate(15 58 65)" />
            <rect x="22" y="113" width="16" height="50" rx="8" fill="white" />
            <rect x="42" y="113" width="16" height="50" rx="8" fill="white" />
            <rect x="10" y="95" width="45" height="30" rx="4" fill="white" opacity="0.6" />
          </g>

          {/* 인물 2 - 서류 들고 있는 남성 */}
          <g transform="translate(220, 60)">
            <circle cx="40" cy="25" r="26" fill="white" />
            <rect x="18" y="51" width="44" height="58" rx="12" fill="white" />
            <rect x="5" y="58" width="15" height="42" rx="7" fill="white" transform="rotate(-10 5 58)" />
            <rect x="60" y="55" width="15" height="42" rx="7" fill="white" transform="rotate(20 60 55)" />
            <rect x="20" y="109" width="17" height="52" rx="8" fill="white" />
            <rect x="43" y="109" width="17" height="52" rx="8" fill="white" />
            <rect x="62" y="52" width="22" height="30" rx="3" fill="white" opacity="0.6" />
          </g>

          {/* 인물 3 - 발표하는 여성 */}
          <g transform="translate(380, 30)">
            <circle cx="42" cy="28" r="27" fill="white" />
            <rect x="22" y="55" width="40" height="56" rx="12" fill="white" />
            <rect x="8" y="58" width="14" height="44" rx="7" fill="white" transform="rotate(-5 8 58)" />
            <rect x="62" y="48" width="14" height="44" rx="7" fill="white" transform="rotate(-45 62 48)" />
            <rect x="22" y="111" width="16" height="50" rx="8" fill="white" />
            <rect x="44" y="111" width="16" height="50" rx="8" fill="white" />
          </g>

          {/* 인물 4 - 태블릿 보는 남성 */}
          <g transform="translate(530, 55)">
            <circle cx="38" cy="26" r="25" fill="white" />
            <rect x="18" y="51" width="40" height="55" rx="12" fill="white" />
            <rect x="4" y="56" width="14" height="42" rx="7" fill="white" transform="rotate(-12 4 56)" />
            <rect x="55" y="56" width="14" height="42" rx="7" fill="white" transform="rotate(12 55 56)" />
            <rect x="20" y="106" width="16" height="52" rx="8" fill="white" />
            <rect x="42" y="106" width="16" height="52" rx="8" fill="white" />
            <rect x="15" y="72" width="28" height="38" rx="5" fill="white" opacity="0.6" />
          </g>

          {/* 인물 5 - 손 흔드는 여성 */}
          <g transform="translate(670, 45)">
            <circle cx="38" cy="28" r="26" fill="white" />
            <rect x="18" y="54" width="40" height="55" rx="12" fill="white" />
            <rect x="6" y="60" width="14" height="40" rx="7" fill="white" transform="rotate(-8 6 60)" />
            <rect x="56" y="40" width="14" height="40" rx="7" fill="white" transform="rotate(-50 56 40)" />
            <rect x="20" y="109" width="16" height="50" rx="8" fill="white" />
            <rect x="42" y="109" width="16" height="50" rx="8" fill="white" />
          </g>

          {/* 장식 - 별/반짝이 */}
          <circle cx="170" cy="60" r="5" fill="white" opacity="0.5" />
          <circle cx="350" cy="40" r="4" fill="white" opacity="0.4" />
          <circle cx="520" cy="55" r="6" fill="white" opacity="0.3" />
          <circle cx="650" cy="35" r="4" fill="white" opacity="0.5" />
          <circle cx="750" cy="70" r="5" fill="white" opacity="0.4" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-base backdrop-blur-sm md:text-lg">
          <span className="font-medium">{PROGRAM.organizer}</span>
          <span className="text-white/60">|</span>
          <span>{PROGRAM.project}</span>
        </div>

        <h1 className="mb-8 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl md:leading-tight">
          글로벌 이커머스 &<br />
          세일즈 기획 실무 과정
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80 md:text-2xl">
          현직자에게 배우는 350시간 실무 교육,
          <br className="hidden sm:block" />
          수료 후 유급 인턴십까지 한 번에
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-3 md:gap-4">
          <span className="rounded-full bg-accent px-5 py-2.5 text-base font-semibold text-primary-950 md:text-lg">
            교육비 무료
          </span>
          <span className="rounded-full bg-white/15 px-5 py-2.5 text-base font-semibold backdrop-blur-sm md:text-lg">
            교육 수당 지급
          </span>
          <span className="rounded-full bg-white/15 px-5 py-2.5 text-base font-semibold backdrop-blur-sm md:text-lg">
            유급 인턴 연계
          </span>
        </div>

        {open ? (
          <a
            href={UCANSIGN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-xl font-bold text-primary-800 shadow-lg transition-all hover:bg-primary-50 hover:shadow-xl"
          >
            지금 신청하기
            <ArrowRight className="h-6 w-6" />
          </a>
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
        </div>
      </div>
    </section>
  );
}
