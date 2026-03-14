import type { Metadata } from "next";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hiseoulbiz-landing.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "2026 글로벌 이커머스 & 세일즈 기획 실무 과정 | 교육생 모집",
  description:
    "무료 교육, 일 25,000원 수당, 월 253만원 인턴십. 서울 거주 만 18~39세 청년 대상. 3월 31일 마감. (사)하이서울기업협회",
  openGraph: {
    title: "2026 글로벌 이커머스 & 세일즈 기획 실무 과정",
    description:
      "교육비 0원 | 일 25,000원 수당 | 월 253만원 인턴십 | 모집 마감 3/31",
    siteName: "(사)하이서울기업협회",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
