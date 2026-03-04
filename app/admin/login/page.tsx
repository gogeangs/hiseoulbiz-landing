"use client";

import { useState } from "react";
import { Lock, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "로그인에 실패했습니다.");
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로그인에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
            <Lock className="h-8 w-8 text-primary-700" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">관리자 로그인</h1>
          <p className="mt-1 text-sm text-gray-500">
            비밀번호를 입력해 주세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoFocus
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
