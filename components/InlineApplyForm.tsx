"use client";

import { useState } from "react";
import { isApplicationOpen } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { DEADLINE_ISO, PROGRAM } from "@/lib/constants";
import { Loader2, CheckCircle2, AlertCircle, Clock, Users } from "lucide-react";
import { trackLead } from "@/lib/fbq";
import Link from "next/link";

export default function InlineApplyForm() {
  const open = isApplicationOpen();
  const { days, mounted } = useCountdown(DEADLINE_ISO);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });

  if (!open) return null;

  const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validations = {
    name: name.trim().length >= 1,
    phone: phoneRegex.test(phone.trim()),
    email: emailRegex.test(email.trim()),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    if (!validations.name || !validations.phone || !validations.email) {
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, privacyConsent }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "제출에 실패했습니다.");
      }

      trackLead();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="apply" className="bg-primary-50 py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold text-primary-900">신청이 완료되었습니다!</h2>
          <p className="text-gray-600">
            입력하신 이메일로 신청서 작성 안내를 보내드렸습니다.<br />
            메일함을 확인해 주세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="bg-primary-50 py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4">
        {mounted && days <= 14 && (
          <div className={`mb-6 flex items-center justify-center gap-4 rounded-xl px-4 py-3 text-sm font-medium ${
            days <= 3 ? "bg-red-100 text-red-700" : "bg-amber-50 text-amber-700"
          }`}>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              마감까지 <strong>D-{days}일</strong>
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              모집 인원 <strong>{PROGRAM.capacity}명</strong>
            </span>
          </div>
        )}

        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-primary-900 md:text-3xl">
            간편 신청
          </h2>
          <p className="text-gray-600">
            3가지 정보만 입력하면 바로 신청 완료!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                placeholder="홍길동"
                required
                className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
                  touched.name && !validations.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-100"
                }`}
              />
              {touched.name && !validations.name && (
                <p className="mt-1 text-xs text-red-500">이름을 입력해 주세요.</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                placeholder="010-1234-5678"
                inputMode="tel"
                required
                className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
                  touched.phone && !validations.phone
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-100"
                }`}
              />
              {touched.phone && !validations.phone && (
                <p className="mt-1 text-xs text-red-500">올바른 연락처를 입력해 주세요.</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                type="email"
                placeholder="example@email.com"
                required
                className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 ${
                  touched.email && !validations.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-100"
                }`}
              />
              {touched.email && !validations.email && (
                <p className="mt-1 text-xs text-red-500">올바른 이메일을 입력해 주세요.</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">
                개인정보(이름, 연락처, 이메일) 수집·이용에 동의합니다.{" "}
                <Link href="/privacy" target="_blank" className="text-primary-700 underline underline-offset-2">
                  개인정보처리방침
                </Link>
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !privacyConsent}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                제출 중...
              </>
            ) : (
              "지금 바로 신청하기"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
