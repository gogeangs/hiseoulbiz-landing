"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, Wallet, Briefcase } from "lucide-react";
import { BENEFITS } from "@/lib/constants";

const iconMap = {
  GraduationCap,
  Wallet,
  Briefcase,
};

export default function Benefits() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="benefits" className="bg-gray-50 py-16 md:py-20" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          이 과정이 특별한 이유
        </h2>
        <p className="mb-12 text-center text-gray-500">
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
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                  <Icon className="h-8 w-8 text-primary-700" />
                </div>
                <p className="mb-2 text-sm font-medium text-primary-600">
                  {benefit.label}
                </p>
                <p className="mb-3 whitespace-nowrap text-4xl font-bold text-primary-900">
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
