"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { APPLY_URL, isApplicationOpen } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isApplicationOpen()) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href={APPLY_URL}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 py-4 text-lg font-bold text-white shadow-2xl transition-colors hover:bg-primary-800"
      >
        신청하기
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
