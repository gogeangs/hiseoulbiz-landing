"use client";

import { useRef, useState } from "react";
import { FAQ_ITEMS } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ChevronDown } from "lucide-react";

function AccordionPanel({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
      style={{
        maxHeight: isOpen ? contentRef.current?.scrollHeight ?? 500 : 0,
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div ref={contentRef} className="border-t border-gray-50 bg-gray-50/50 px-6 py-5">
        {children}
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="faq" className="py-16 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={`mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          자주 묻는 질문
        </h2>
        <p className={`mb-12 text-center text-gray-600 transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          궁금한 점이 있으시면 아래를 확인해 주세요
        </p>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: `${200 + idx * 80}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="pr-4 font-medium text-primary-900">
                  Q. {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AccordionPanel isOpen={openIndex === idx}>
                <p className="leading-relaxed text-gray-600">{item.answer}</p>
              </AccordionPanel>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
