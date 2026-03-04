"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Download, Loader2, Mail, Check, X, Plus } from "lucide-react";
import { SEOUL_DISTRICTS } from "@/lib/validations";
import { BONUS_TARGETS } from "@/lib/constants";
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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sendResult, setSendResult] = useState<{
    sent: number;
    failed: number;
  } | null>(null);

  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    district: "",
    bonusTargets: [] as string[],
  };
  const [addForm, setAddForm] = useState(emptyForm);

  const handleAddSubmit = async () => {
    if (!addForm.name || !addForm.phone || !addForm.email) {
      alert("이름, 연락처, 이메일을 입력해 주세요.");
      return;
    }
    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "등록에 실패했습니다.");
        return;
      }
      setShowAddModal(false);
      setAddForm(emptyForm);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleBonusTarget = (target: string) => {
    setAddForm((prev) => ({
      ...prev,
      bonusTargets: prev.bonusTargets.includes(target)
        ? prev.bonusTargets.filter((t) => t !== target)
        : [...prev.bonusTargets, target],
    }));
  };

  const applyFilters = (newSearch: string, newDistrict: string) => {
    setSelectedIds(new Set());
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

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(applications.map((a) => a.id)));
    }
  };

  const handleSendEmail = async () => {
    setShowConfirmModal(false);
    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds: Array.from(selectedIds) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "발송에 실패했습니다.");
        return;
      }

      const data = await res.json();
      setSendResult({ sent: data.sent, failed: data.failed });
      setSelectedIds(new Set());
      startTransition(() => {
        router.refresh();
      });
    } catch {
      alert("이메일 발송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  const escapeCSV = (value: string | number): string => {
    let str = String(value);
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str.replace(/"/g, '""')}"`;
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
      "이메일발송",
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
      app.email_sent_at
        ? new Date(app.email_sent_at).toLocaleString("ko-KR")
        : "미발송",
    ]);

    const bom = "\uFEFF";
    const csv =
      bom +
      [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n");

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
      {/* 발송 결과 배너 */}
      {sendResult && (
        <div className="flex items-center justify-between border-b bg-green-50 px-4 py-3">
          <p className="text-sm text-green-800">
            이메일 발송 완료: 성공 {sendResult.sent}건
            {sendResult.failed > 0 && `, 실패 ${sendResult.failed}건`}
          </p>
          <button
            onClick={() => setSendResult(null)}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
            onClick={() => setShowConfirmModal(true)}
            disabled={selectedIds.size === 0 || isSending}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            이메일 발송{selectedIds.size > 0 && ` (${selectedIds.size})`}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            추가
          </button>
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
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    applications.length > 0 &&
                    selectedIds.size === applications.length
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 font-medium text-gray-500">#</th>
              <th className="px-4 py-3 font-medium text-gray-500">이름</th>
              <th className="px-4 py-3 font-medium text-gray-500">연락처</th>
              <th className="px-4 py-3 font-medium text-gray-500">이메일</th>
              <th className="px-4 py-3 font-medium text-gray-500">생년월일</th>
              <th className="px-4 py-3 font-medium text-gray-500">지역</th>
              <th className="px-4 py-3 font-medium text-gray-500">가점대상</th>
              <th className="px-4 py-3 font-medium text-gray-500">신청일시</th>
              <th className="px-4 py-3 font-medium text-gray-500">발송</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
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
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(app.id)}
                      onChange={() => toggleSelect(app.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
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
                  <td className="px-4 py-3 text-center">
                    {app.email_sent_at ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                        <Check className="h-3 w-3" />
                        발송완료
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">미발송</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 신청자 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">신청자 추가</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.phone}
                  onChange={(e) => setAddForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="010-1234-5678"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  생년월일
                </label>
                <input
                  type="date"
                  value={addForm.birthDate}
                  onChange={(e) => setAddForm((p) => ({ ...p, birthDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  거주지역
                </label>
                <select
                  value={addForm.district}
                  onChange={(e) => setAddForm((p) => ({ ...p, district: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">선택해 주세요</option>
                  {SEOUL_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  가점대상 (선택)
                </label>
                <div className="flex flex-wrap gap-2">
                  {BONUS_TARGETS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleBonusTarget(t)}
                      className={`rounded-full px-3 py-1 text-xs transition-colors ${
                        addForm.bonusTargets.includes(t)
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowAddModal(false); setAddForm(emptyForm); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={isAdding}
                className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이메일 발송 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">
              이메일 발송 확인
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              선택한 <strong>{selectedIds.size}명</strong>에게 서울시청 제출용
              신청서 안내 이메일을 발송합니다.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSendEmail}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
              >
                발송하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
