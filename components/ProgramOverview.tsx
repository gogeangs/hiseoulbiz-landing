import { PROGRAM } from "@/lib/constants";
import {
  CalendarDays,
  Clock,
  MapPin,
  UserCheck,
  Users,
  CreditCard,
} from "lucide-react";

const items = [
  {
    icon: CalendarDays,
    label: "교육 기간",
    value: PROGRAM.period,
    sub: `총 ${PROGRAM.totalDays}일`,
  },
  {
    icon: Clock,
    label: "교육 시간",
    value: PROGRAM.time,
    sub: `1일 ${PROGRAM.dailyHours}시간, 총 ${PROGRAM.totalHours}시간`,
  },
  {
    icon: MapPin,
    label: "교육 장소",
    value: PROGRAM.location,
    sub: PROGRAM.locationDetail,
  },
  {
    icon: UserCheck,
    label: "교육 대상",
    value: PROGRAM.targetAge,
    sub: "서울시 거주 구직자",
  },
  {
    icon: Users,
    label: "모집 인원",
    value: `${PROGRAM.capacity}명`,
    sub: "소수 정예 밀착 교육",
  },
  {
    icon: CreditCard,
    label: "교육비",
    value: "전액 무료",
    sub: "수강료·교재비 없음",
  },
];

export default function ProgramOverview() {
  return (
    <section id="overview" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          교육 개요
        </h2>
        <p className="mb-12 text-center text-gray-600">
          글로벌 시장을 무대로 성장하고 싶은 청년을 위한 실전 중심 과정
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <item.icon className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="font-semibold text-primary-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
