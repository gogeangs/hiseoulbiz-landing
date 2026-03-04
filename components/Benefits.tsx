"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GraduationCap, Wallet, Briefcase } from "lucide-react";
import { BENEFITS } from "@/lib/constants";

const iconMap = {
  GraduationCap,
  Wallet,
  Briefcase,
};

function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (start) animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, animate]);

  return value;
}

function formatNumber(n: number) {
  return n.toLocaleString("ko-KR");
}

function CountUpValue({ target, prefix = "", suffix = "", start }: { target: number; prefix?: string; suffix?: string; start: boolean }) {
  const value = useCountUp(target, 1800, start);
  return (
    <span>
      {prefix}{formatNumber(value)}{suffix}
    </span>
  );
}

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

  // 카운트업 설정: label 기준으로 target 숫자와 포맷 결정
  const countUpConfig: Record<string, { target: number; prefix: string; suffix: string }> = {
    "교육비": { target: 0, prefix: "", suffix: "원" },
    "교육 수당": { target: 25000, prefix: "일 ", suffix: "원" },
    "인턴 급여": { target: 2533280, prefix: "월 ", suffix: "원" },
  };

  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-primary-900 py-16 text-white md:py-20"
      ref={sectionRef}
    >
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-accent/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          참여 혜택
        </h2>
        <p className="mb-12 text-center text-white/60">
          배우면서 수당까지, 수료 후 취업까지
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon];
            const config = countUpConfig[benefit.label];
            return (
              <div
                key={benefit.label}
                className={`rounded-2xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-sm transition-all duration-700 hover:bg-white/15 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
                  <Icon className="h-7 w-7 text-accent" />
                </div>
                <p className="mb-1 text-sm font-medium text-white/60">
                  {benefit.label}
                </p>
                <p className="mb-3 whitespace-nowrap text-3xl font-bold text-white">
                  {config ? (
                    <CountUpValue
                      target={config.target}
                      prefix={config.prefix}
                      suffix={config.suffix}
                      start={visible}
                    />
                  ) : (
                    benefit.value
                  )}
                </p>
                <p className="break-keep text-sm leading-relaxed text-white/50">
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
