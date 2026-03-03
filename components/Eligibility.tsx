"use client";

import { useState } from "react";
import { ELIGIBILITY, BONUS_TARGETS } from "@/lib/constants";
import { CheckCircle2, ChevronDown, Star } from "lucide-react";

export default function Eligibility() {
  const [bonusOpen, setBonusOpen] = useState(false);

  return (
    <section id="eligibility" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          지원 자격
        </h2>
        <p className="mb-12 text-center text-gray-600">
          아래 조건을 모두 충족하는 분이 지원 가능합니다
        </p>

        <div className="mx-auto max-w-2xl space-y-4">
          {ELIGIBILITY.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <p className="text-gray-700">{item}</p>
            </div>
          ))}

          <button
            onClick={() => setBonusOpen(!bonusOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-primary-100 bg-primary-50 p-4 text-left transition-colors hover:bg-primary-100"
          >
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 shrink-0 text-accent" />
              <span className="font-medium text-primary-800">
                가점 대상 확인하기
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-primary-600 transition-transform ${
                bonusOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {bonusOpen && (
            <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-5">
              <p className="mb-3 text-sm font-medium text-primary-800">
                아래 해당자는 선발 시 가점이 부여됩니다.
              </p>
              <ul className="space-y-2">
                {BONUS_TARGETS.map((target) => (
                  <li
                    key={target}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    {target}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
