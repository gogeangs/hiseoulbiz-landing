"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationSchema,
  SEOUL_DISTRICTS,
  type ApplicationFormData,
} from "@/lib/validations";
import { PROGRAM } from "@/lib/constants";
import { isApplicationOpen } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function ApplyPage() {
  const open = isApplicationOpen();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      birthDate: "",
      district: "",
      motivation: "",
      experience: "",
      goals: "",
    },
  });

  const motivationLength = watch("motivation")?.length || 0;
  const experienceLength = watch("experience")?.length || 0;
  const goalsLength = watch("goals")?.length || 0;

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "제출에 실패했습니다.");
      }

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
                  생년월일 <span className="text-red-500">*</span>
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
                  서울시 거주 지역 <span className="text-red-500">*</span>
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

          {/* 지원 동기 */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-lg font-semibold text-primary-900">
              지원 내용
            </h2>

            <div className="space-y-5">
              {/* 지원동기 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  지원동기 <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("motivation")}
                  rows={5}
                  placeholder="본 과정에 지원하게 된 동기를 작성해 주세요. (50자 이상)"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.motivation ? (
                    <p className="text-sm text-red-500">
                      {errors.motivation.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-xs ${
                      motivationLength < 50 ? "text-gray-400" : "text-green-500"
                    }`}
                  >
                    {motivationLength}/1000
                  </span>
                </div>
              </div>

              {/* 관련 경험 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  관련 경험 <span className="text-gray-400">(선택)</span>
                </label>
                <textarea
                  {...register("experience")}
                  rows={4}
                  placeholder="이커머스, 마케팅, 세일즈 등 관련 경험이 있다면 작성해 주세요."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.experience ? (
                    <p className="text-sm text-red-500">
                      {errors.experience.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-400">
                    {experienceLength}/1000
                  </span>
                </div>
              </div>

              {/* 희망 진로 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  희망 진로 <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("goals")}
                  rows={4}
                  placeholder="교육 수료 후 희망하는 진로나 목표를 작성해 주세요. (30자 이상)"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.goals ? (
                    <p className="text-sm text-red-500">
                      {errors.goals.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-xs ${
                      goalsLength < 30 ? "text-gray-400" : "text-green-500"
                    }`}
                  >
                    {goalsLength}/1000
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 개인정보 동의 */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm leading-relaxed text-gray-500">
              신청 시 입력하신 개인정보(이름, 연락처, 이메일, 생년월일, 거주지역)는
              교육생 선발 목적으로만 활용되며, 선발 완료 후 관련 법령에 따라
              안전하게 관리됩니다.
            </p>
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
