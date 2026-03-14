"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationSchema,
  SEOUL_DISTRICTS,
  type ApplicationFormData,
} from "@/lib/validations";
import { PROGRAM, BONUS_TARGETS } from "@/lib/constants";
import { isApplicationOpen } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { trackLead } from "@/lib/fbq";

export default function ApplyPage() {
  const open = isApplicationOpen();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const utmRef = useRef({ utm_source: "", utm_medium: "", utm_campaign: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    utmRef.current = {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      birthDate: "",
      district: undefined,
      bonusTargets: [],
      privacyConsent: undefined as unknown as true,
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...utmRef.current }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "제출에 실패했습니다.");
      }

      trackLead();
      window.location.href = "/apply/success";
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "제출에 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <AlertCircle className="mb-4 h-16 w-16 text-gray-400" />
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          모집이 마감되었습니다
        </h1>
        <p className="mb-8 text-gray-500">
          {PROGRAM.title} 모집 기간이 종료되었습니다.
        </p>
        <Link
          href="/"
          className="text-primary-700 underline underline-offset-4 hover:text-primary-800"
        >
          메인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            메인으로
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-primary-900 md:text-3xl">
            교육과정 신청
          </h1>
          <p className="text-gray-500">{PROGRAM.title}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 기본 정보 */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-lg font-semibold text-primary-900">
              기본 정보
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {/* 이름 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="홍길동"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* 연락처 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  휴대전화 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone")}
                  placeholder="010-1234-5678"
                  inputMode="tel"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* 이메일 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 생년월일 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  생년월일
                </label>
                <input
                  {...register("birthDate")}
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* 거주 지역 */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  서울시 거주 지역
                </label>
                <select
                  {...register("district")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">선택해 주세요</option>
                  {SEOUL_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 가점 확인 */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-2 text-lg font-semibold text-primary-900">
              가점 대상 확인
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              해당되는 항목이 있으면 체크해 주세요. (선택사항)
            </p>

            <div className="space-y-3">
              {BONUS_TARGETS.map((target) => (
                <label
                  key={target}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-primary-300 hover:bg-primary-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
                >
                  <input
                    type="checkbox"
                    value={target}
                    {...register("bonusTargets")}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{target}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 개인정보 동의 */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("privacyConsent")}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm leading-relaxed text-gray-600">
                신청 시 입력하신 개인정보(이름, 연락처, 이메일, 생년월일,
                거주지역)를 교육생 선발 목적으로 수집·이용하는 것에
                동의합니다.{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 underline underline-offset-2 hover:text-primary-800"
                >
                  개인정보처리방침
                </Link>
              </span>
            </label>
            {errors.privacyConsent && (
              <p className="mt-2 text-sm text-red-500">
                {errors.privacyConsent.message}
              </p>
            )}
          </section>

          {/* 에러 메시지 */}
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {submitError}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 py-4 text-lg font-bold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                제출 중...
              </>
            ) : (
              "신청서 제출하기"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
