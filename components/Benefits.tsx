"use client";

import { GraduationCap, Wallet, Briefcase } from "lucide-react";
import { BENEFITS } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const iconMap = {
  GraduationCap,
  Wallet,
  Briefcase,
};

export default function Benefits() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="benefits" className="bg-gray-50 py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          이 과정이 특별한 이유
        </h2>
        <p className={`mb-12 text-center text-gray-500 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          교육비 전액 무료, 수당 지급, 취업까지 한 번에
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon];
            return (
              <div
                key={benefit.label}
                className={`rounded-2xl border border-primary-100 bg-white p-8 text-center shadow-sm transition-all duration-700 hover:shadow-lg hover:border-primary-200 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${200 + idx * 100}ms` }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                  <Icon className="h-8 w-8 text-primary-700" aria-hidden="true" />
                </div>
                <p className="mb-2 text-sm font-medium text-primary-600">
                  {benefit.label}
                </p>
                <p className="mb-3 break-keep text-3xl font-bold text-primary-900 md:text-4xl">
                  {benefit.value}
                </p>
                <p className="break-keep text-sm leading-relaxed text-gray-500">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
