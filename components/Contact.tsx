"use client";

import Image from "next/image";
import { PROGRAM } from "@/lib/constants";
import Link from "next/link";
import { APPLY_URL, isApplicationOpen } from "@/lib/utils";
import { Phone, Mail, ArrowRight } from "lucide-react";

export default function Contact() {
  const open = isApplicationOpen();

  return (
    <footer id="contact" className="bg-primary-950 pb-24 pt-16 text-white md:pb-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">문의하기</h2>

        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <a
            href={`tel:${PROGRAM.contact.phone}`}
            className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <Phone className="h-5 w-5" />
            <span>{PROGRAM.contact.phone}</span>
          </a>
          <a
            href={`mailto:${PROGRAM.contact.email}`}
            className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <Mail className="h-5 w-5" />
            <span>{PROGRAM.contact.email}</span>
          </a>
        </div>

        <p className="mb-8 text-sm text-white/60">
          {PROGRAM.organizer} {PROGRAM.contact.department}
        </p>

        {open && (
          <Link
            href={APPLY_URL}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-lg font-bold transition-colors hover:bg-primary-500"
          >
            지금 신청하기
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="mb-4 flex items-center justify-center gap-4">
            <Image
              src="/images/logo-seoul.png"
              alt="서울시"
              width={36}
              height={36}
              className="h-8 w-auto brightness-0 invert opacity-50"
            />
            <div className="h-5 w-px bg-white/20" />
            <Image
              src="/images/logo-hiseoul.png"
              alt="하이서울기업협회"
              width={100}
              height={36}
              className="h-8 w-auto brightness-0 invert opacity-50"
            />
          </div>
          <p className="text-sm text-white/50">
            &copy; 2026 {PROGRAM.organizer}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
