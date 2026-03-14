"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const GALLERY_ITEMS = [
  {
    src: "/images/gallery-class.jpg",
    label: "교육 현장",
    title: "현직자 중심 오프라인 클래스",
    span: "md:col-span-2 md:row-span-2",
    height: "h-48 md:h-full",
  },
  {
    src: "/images/gallery-practice.jpg",
    label: "실습 화면",
    title: "대시보드·광고 세팅 실습",
    span: "",
    height: "h-48",
  },
  {
    src: "/images/gallery-portfolio.jpg",
    label: "성과 결과물",
    title: "포트폴리오 카드 완성",
    span: "",
    height: "h-48",
  },
  {
    src: "/images/gallery-team.jpg",
    label: "협업 프로젝트",
    title: "팀별 과제와 발표",
    span: "md:col-span-2",
    height: "h-48",
  },
];

export default function PointBanner() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section className="bg-white py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2
          className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          이런 환경에서 배웁니다
        </h2>
        <p
          className={`mb-12 text-center text-gray-500 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          교육 현장과 결과물을 미리 만나보세요
        </p>

        <div className="grid gap-4 md:grid-cols-4 md:auto-rows-[200px]">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={item.label}
              className={`group relative overflow-hidden rounded-2xl ${item.span} transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${200 + idx * 100}ms` }}
            >
              <div className={`relative w-full ${item.height}`}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {item.label}
                  </span>
                  <p className="break-keep text-lg font-bold text-white">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
