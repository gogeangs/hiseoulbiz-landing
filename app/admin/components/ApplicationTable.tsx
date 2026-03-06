"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Download, Loader2, Mail, Check, X, Plus, Pencil, Trash2, CircleCheck, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { SEOUL_DISTRICTS } from "@/lib/validations";
import { BONUS_TARGETS } from "@/lib/constants";
import type { ApplicationRow } from "@/lib/db";

interface ApplicationTableProps {
  applications: ApplicationRow[];
  initialSearch?: string;
  initialDistrict?: string;
  statsFilter?: string;
}

type FormData = {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  district: string;
  bonusTargets: string[];
};

const emptyForm: FormData = {
  name: "",
  phone: "",
  email: "",
  birthDate: "",
  district: "",
  bonusTargets: [],
};

export default function ApplicationTable({
  applications,
  initialSearch,
  initialDistrict,
  statsFilter,
}: ApplicationTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch ?? "");
  const [district, setDistrict] = useState(initialDistrict ?? "");
  const [sentFilter, setSentFilter] = useState<"" | "sent" | "unsent" | "failed">("");
  const [completedFilter, setCompletedFilter] = useState<"" | "completed" | "uncompleted">("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sendResult, setSendResult] = useState<{
    sent: number;
    failed: number;
  } | null>(null);

  // 추가 폼
  const [addForm, setAddForm] = useState<FormData>(emptyForm);

  // 수정 폼
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormData>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  // 삭제 확인
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [togglingSmsId, setTogglingSmsId] = useState<number | null>(null);

  // 페이지네이션
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  // 오늘 날짜 (KST 기준)
  const todayStr = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });

  // 클라이언트 사이드 필터링
  const filtered = applications.filter((app) => {
    // statsFilter 적용
    if (statsFilter === "today") {
      const appDate = new Date(app.submitted_at).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });
      if (appDate !== todayStr) return false;
    }
    if (statsFilter === "completed" && !app.completed_at) return false;

    if (sentFilter === "sent" && !app.email_sent_at) return false;
    if (sentFilter === "failed" && !app.email_error) return false;
    if (sentFilter === "unsent" && (app.email_sent_at || app.email_error)) return false;
    if (completedFilter === "completed" && !app.completed_at) return false;
    if (completedFilter === "uncompleted" && app.completed_at) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasActiveFilter = !!(search || district || sentFilter || completedFilter);

  const handleToggleSms = async (id: number) => {
    setTogglingSmsId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "sms" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "처리에 실패했습니다.");
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch {
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setTogglingSmsId(null);
    }
  };

  const handleToggleComplete = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "처리에 실패했습니다.");
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch {
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setTogglingId(null);
    }
  };

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

  const openEditModal = (app: ApplicationRow) => {
    setEditingId(app.id);
    setEditForm({
      name: app.name,
      phone: app.phone,
      email: app.email,
      birthDate: app.birth_date || "",
      district: app.district || "",
      bonusTargets: app.bonus_targets ?? [],
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editForm.name || !editForm.phone || !editForm.email) {
      alert("이름, 연락처, 이메일을 입력해 주세요.");
      return;
    }
    setIsEditing(true);
    try {
      const res = await fetch(`/api/admin/applications/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "수정에 실패했습니다.");
        return;
      }
      setShowEditModal(false);
      setEditingId(null);
      setEditForm(emptyForm);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsEditing(false);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "삭제에 실패했습니다.");
        return;
      }
      setShowDeleteConfirm(false);
      setDeletingId(null);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (deletingId) next.delete(deletingId);
        return next;
      });
      startTransition(() => {
        router.refresh();
      });
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFormBonusTarget = (
    setter: React.Dispatch<React.SetStateAction<FormData>>,
    target: string
  ) => {
    setter((prev) => ({
      ...prev,
      bonusTargets: prev.bonusTargets.includes(target)
        ? prev.bonusTargets.filter((t) => t !== target)
        : [...prev.bonusTargets, target],
    }));
  };

  const applyFilters = (newSearch: string, newDistrict: string) => {
    setSelectedIds(new Set());
    setCurrentPage(1);
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
    const pageIds = paged.map((a) => a.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => new Set([...prev, ...pageIds]));
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
      "문자발송",
      "제출완료",
    ];
    const rows = filtered.map((app, idx) => [
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
      app.sms_sent_at
        ? new Date(app.sms_sent_at).toLocaleString("ko-KR")
        : "미발송",
      app.completed_at
        ? new Date(app.completed_at).toLocaleString("ko-KR")
        : "미완료",
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

  // 이메일 발송 확인 모달용: 이미 발송된 건수
  const alreadySentCount = filtered.filter(
    (a) => selectedIds.has(a.id) && a.email_sent_at
  ).length;

  const renderFormFields = (
    form: FormData,
    setter: React.Dispatch<React.SetStateAction<FormData>>
  ) => (
    <div className="mt-4 space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setter((p) => ({ ...p, name: e.target.value }))}
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
          value={form.phone}
          onChange={(e) => setter((p) => ({ ...p, phone: e.target.value }))}
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
          value={form.email}
          onChange={(e) => setter((p) => ({ ...p, email: e.target.value }))}
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
          value={form.birthDate}
          onChange={(e) => setter((p) => ({ ...p, birthDate: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          거주지역
        </label>
        <select
          value={form.district}
          onChange={(e) => setter((p) => ({ ...p, district: e.target.value }))}
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
              onClick={() => toggleFormBonusTarget(setter, t)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                form.bonusTargets.includes(t)
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
  );

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
      <div className="flex flex-col gap-3 border-b p-4">
        <div className="flex flex-wrap gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 연락처, 이메일 검색"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-9 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDistrict("");
                  setSentFilter("");
                  setCompletedFilter("");
                  applyFilters("", "");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="검색 초기화"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
          <select
            value={sentFilter}
            onChange={(e) => { setSentFilter(e.target.value as "" | "sent" | "unsent" | "failed"); setSelectedIds(new Set()); setCurrentPage(1); }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">발송 전체</option>
            <option value="sent">발송완료</option>
            <option value="failed">발송실패</option>
            <option value="unsent">미발송</option>
          </select>
          <select
            value={completedFilter}
            onChange={(e) => { setCompletedFilter(e.target.value as "" | "completed" | "uncompleted"); setSelectedIds(new Set()); setCurrentPage(1); }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">제출 전체</option>
            <option value="completed">제출완료</option>
            <option value="uncompleted">미제출</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
          <span className="text-sm text-gray-500">
            총 {filtered.length}건
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
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="w-10 px-3 py-3 text-center">
                <input
                  type="checkbox"
                  checked={
                    paged.length > 0 &&
                    paged.every((a) => selectedIds.has(a.id))
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              <th className="w-10 px-2 py-3 text-center font-medium text-gray-500">#</th>
              <th className="w-20 px-2 py-3 font-medium text-gray-500">이름</th>
              <th className="px-2 py-3 font-medium text-gray-500">연락처</th>
              <th className="px-2 py-3 font-medium text-gray-500">이메일</th>
              <th className="px-2 py-3 font-medium text-gray-500">생년월일</th>
              <th className="w-16 px-2 py-3 font-medium text-gray-500">지역</th>
              <th className="px-2 py-3 font-medium text-gray-500">가점대상</th>
              <th className="px-2 py-3 font-medium text-gray-500">신청일시</th>
              <th className="w-16 px-2 py-3 text-center font-medium text-gray-500">메일</th>
              <th className="w-12 px-2 py-3 text-center font-medium text-gray-500">문자</th>
              <th className="w-12 px-2 py-3 text-center font-medium text-gray-500">제출</th>
              <th className="w-16 px-2 py-3 text-center font-medium text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  className="px-2 py-12 text-center text-gray-400"
                >
                  {hasActiveFilter
                    ? "검색 결과가 없습니다."
                    : "아직 신청 데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((app, idx) => (
                <tr
                  key={app.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(app.id)}
                      onChange={() => toggleSelect(app.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-2 py-3 text-center text-gray-400">{(safePage - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-2 py-3 font-medium text-gray-900">
                    {app.name}
                  </td>
                  <td className="px-2 py-3 text-gray-600">{app.phone}</td>
                  <td className="px-2 py-3 text-gray-600">{app.email}</td>
                  <td className="px-2 py-3 text-gray-600">
                    {app.birth_date}
                  </td>
                  <td className="px-2 py-3 text-gray-600">{app.district}</td>
                  <td className="px-2 py-3 !whitespace-normal">
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
                  <td className="whitespace-nowrap px-2 py-3 text-gray-500">
                    {new Date(app.submitted_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {app.email_sent_at ? (
                      <CircleCheck className="mx-auto h-5 w-5 text-green-600" />
                    ) : app.email_error ? (
                      <span
                        className="cursor-help"
                        title={app.email_error}
                      >
                        <X className="mx-auto h-5 w-5 text-red-500" />
                      </span>
                    ) : (
                      <Circle className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button
                      onClick={() => handleToggleSms(app.id)}
                      disabled={togglingSmsId === app.id}
                      className="inline-flex items-center gap-1 disabled:opacity-50"
                      title={app.sms_sent_at ? "발송완료 해제" : "발송완료 처리"}
                    >
                      {togglingSmsId === app.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      ) : app.sms_sent_at ? (
                        <CircleCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button
                      onClick={() => handleToggleComplete(app.id)}
                      disabled={togglingId === app.id}
                      className="inline-flex items-center gap-1 disabled:opacity-50"
                      title={app.completed_at ? "제출 완료 해제" : "제출 완료 처리"}
                    >
                      {togglingId === app.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      ) : app.completed_at ? (
                        <CircleCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(app)}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        title="수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(app.id)}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-sm text-gray-500">
            {filtered.length}건 중 {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              처음
            </button>
            <button
              onClick={() => setCurrentPage(safePage - 1)}
              disabled={safePage === 1}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-sm text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`min-w-[32px] rounded px-2 py-1 text-sm ${
                      p === safePage
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setCurrentPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
              마지막
            </button>
          </div>
        </div>
      )}

      {/* 신청자 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">신청자 추가</h3>
            {renderFormFields(addForm, setAddForm)}
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

      {/* 신청자 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">신청자 수정</h3>
            {renderFormFields(editForm, setEditForm)}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowEditModal(false); setEditingId(null); setEditForm(emptyForm); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isEditing}
                className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {isEditing && <Loader2 className="h-4 w-4 animate-spin" />}
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">신청자 삭제</h3>
            <p className="mt-2 text-sm text-gray-600">
              해당 신청자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeletingId(null); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                삭제
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
            {alreadySentCount > 0 && (
              <p className="mt-1 text-sm text-amber-600">
                이미 발송된 {alreadySentCount}건이 포함되어 있습니다. (재발송)
              </p>
            )}
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
