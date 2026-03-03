"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          자주 묻는 질문
        </h2>
        <p className="mb-12 text-center text-gray-600">
          궁금한 점이 있으시면 아래를 확인해 주세요
        </p>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="pr-4 font-medium text-primary-900">
                  Q. {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="border-t border-gray-50 bg-gray-50/50 px-6 py-5">
                  <p className="leading-relaxed text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
