"use client";

import { LogOut } from "lucide-react";

export default function AdminHeader() {
  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <h1 className="text-lg font-bold text-primary-900">신청 관리</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </header>
  );
}
