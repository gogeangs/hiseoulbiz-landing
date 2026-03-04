"use client";

import { useCountdown } from "@/hooks/useCountdown";
import Link from "next/link";
import { APPLY_URL } from "@/lib/utils";

export default function CountdownBanner() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    "2026-03-31T23:59:59+09:00"
  );

  if (isExpired) {
    return (
      <div className="bg-gray-600 py-2.5 text-center text-sm font-medium text-white">
        모집이 마감되었습니다
      </div>
    );
  }

  return (
    <Link
      href={APPLY_URL}
      className="block bg-primary-700 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-600"
    >
      <span className="hidden sm:inline">모집 마감까지 </span>
      <span className="font-bold">
        D-{days}일 {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
      <span className="ml-2 hidden sm:inline">| 지금 신청하기 →</span>
      <span className="ml-2 sm:hidden">→ 신청하기</span>
    </Link>
  );
}
