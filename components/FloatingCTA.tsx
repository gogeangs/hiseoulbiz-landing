"use client";

import { useState, useEffect } from "react";
import { isApplicationOpen } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const applyEl = document.getElementById("apply");
          if (applyEl) {
            const rect = applyEl.getBoundingClientRect();
            const formVisible = rect.top < window.innerHeight && rect.bottom > 0;
            setVisible(window.scrollY > 600 && !formVisible);
          } else {
            setVisible(window.scrollY > 600);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isApplicationOpen()) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="#apply"
        className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl bg-primary-700 py-4 text-lg font-bold text-white shadow-2xl transition-colors hover:bg-primary-800"
      >
        신청하기
        <ArrowRight className="h-5 w-5" />
      </a>
    </div>
  );
}
