"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { APPLY_URL, isApplicationOpen } from "@/lib/utils";
import { PROGRAM } from "@/lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const open = isApplicationOpen();

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow ${
        scrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <span className="text-base font-bold text-primary-900 md:text-lg">
          {PROGRAM.title}
        </span>
        {open ? (
          <Link
            href={APPLY_URL}
            className="shrink-0 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
          >
            신청하기
          </Link>
        ) : (
          <span className="shrink-0 rounded-lg bg-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-500">
            모집 마감
          </span>
        )}
      </div>
    </header>
  );
}
