"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import { SEOUL_DISTRICTS } from "@/lib/validations";
import type { ApplicationRow } from "@/lib/db";

interface ApplicationTableProps {
  applications: ApplicationRow[];
  initialSearch?: string;
  initialDistrict?: string;
}

export default function ApplicationTable({
  applications,
  initialSearch,
  initialDistrict,
}: ApplicationTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch ?? "");
  const [district, setDistrict] = useState(initialDistrict ?? "");

  const applyFilters = (newSearch: string, newDistrict: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newDistrict) params.set("district", newDistrict);
    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search, district);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    applyFilters(search, value);
  };

  const handleExport = () => {
    const headers = [
      "번호",
      "이름",
      "연락처",
      "이메일",
      "생년월일",
      "거주지역",
      "가점대상",
      "신청일시",
    ];
    const rows = applications.map((app, idx) => [
      idx + 1,
      app.name,
      app.phone,
      app.email,
      app.birth_date,
      app.district,
      app.bonus_targets?.join(", ") ?? "",
      new Date(app.submitted_at).toLocaleString("ko-KR"),
    ]);

    const bom = "\uFEFF";
    const csv =
      bom +
      [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `신청현황_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* 필터 바 */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 연락처, 이메일 검색"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </form>
          <select
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">전체 지역</option>
            {SEOUL_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
          <span className="text-sm text-gray-500">
            총 {applications.length}건
          </span>
          <button
            onClick={handleExport}
            disabled={applications.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-500">#</th>
              <th className="px-4 py-3 font-medium text-gray-500">이름</th>
              <th className="px-4 py-3 font-medium text-gray-500">연락처</th>
              <th className="px-4 py-3 font-medium text-gray-500">이메일</th>
              <th className="px-4 py-3 font-medium text-gray-500">생년월일</th>
              <th className="px-4 py-3 font-medium text-gray-500">지역</th>
              <th className="px-4 py-3 font-medium text-gray-500">가점대상</th>
              <th className="px-4 py-3 font-medium text-gray-500">신청일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  {search || district
                    ? "검색 결과가 없습니다."
                    : "아직 신청 데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              applications.map((app, idx) => (
                <tr
                  key={app.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {app.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{app.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {app.birth_date}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.district}</td>
                  <td className="px-4 py-3">
                    {app.bonus_targets && app.bonus_targets.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {app.bonus_targets.map((t) => (
                          <span
                            key={t}
                            className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {new Date(app.submitted_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
