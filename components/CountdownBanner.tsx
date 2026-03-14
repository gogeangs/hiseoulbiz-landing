"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { DEADLINE_ISO } from "@/lib/constants";

export default function CountdownBanner() {
  const { days, hours, minutes, seconds, isExpired, mounted } =
    useCountdown(DEADLINE_ISO);

  if (!mounted) {
    return (
      <div className="bg-primary-700 py-2.5 text-center text-sm font-medium text-white">
        &nbsp;
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-gray-600 py-2.5 text-center text-sm font-medium text-white">
        모집이 마감되었습니다
      </div>
    );
  }

  return (
    <a
      href="#apply"
      className="block bg-primary-700 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-600"
    >
      <span className="hidden sm:inline">모집 마감까지 </span>
      <span className="font-bold">
        D-{days}일 {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
      <span className="ml-2 hidden sm:inline">| 지금 신청하기 →</span>
      <span className="ml-2 sm:hidden">→ 신청하기</span>
    </a>
  );
}
