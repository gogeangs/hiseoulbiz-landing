import { Users, CalendarPlus, ClipboardCheck } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    today: number;
    completed: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary-50 p-2.5">
            <Users className="h-5 w-5 text-primary-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">총 신청</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.total}명
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-50 p-2.5">
            <CalendarPlus className="h-5 w-5 text-green-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">오늘 신청</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.today}명
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-50 p-2.5">
            <ClipboardCheck className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">제출 완료</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.completed}명
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
