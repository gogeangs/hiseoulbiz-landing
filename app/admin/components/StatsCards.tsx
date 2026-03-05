"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Users, CalendarPlus, ClipboardCheck } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    today: number;
    completed: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("statsFilter") || "";

  const handleClick = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeFilter === filter) {
      params.delete("statsFilter");
    } else {
      params.set("statsFilter", filter);
    }
    // 다른 필터 초기화
    params.delete("search");
    params.delete("district");
    router.push(`/admin?${params.toString()}`);
  };

  const cards = [
    {
      key: "all",
      label: "총 신청",
      value: stats.total,
      icon: Users,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-700",
      ringColor: "ring-primary-300",
    },
    {
      key: "today",
      label: "오늘 신청",
      value: stats.today,
      icon: CalendarPlus,
      iconBg: "bg-green-50",
      iconColor: "text-green-700",
      ringColor: "ring-green-300",
    },
    {
      key: "completed",
      label: "제출 완료",
      value: stats.completed,
      icon: ClipboardCheck,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
      ringColor: "ring-amber-300",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.key;
        return (
          <button
            key={card.key}
            onClick={() => handleClick(card.key)}
            className={`rounded-2xl border bg-white p-6 shadow-sm text-left transition-all hover:shadow-md ${
              isActive
                ? `border-transparent ring-2 ${card.ringColor}`
                : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg ${card.iconBg} p-2.5`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}명
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
