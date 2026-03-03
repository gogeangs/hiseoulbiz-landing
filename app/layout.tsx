import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "2026 글로벌 이커머스 & 세일즈 기획 실무 과정 | 교육생 모집",
  description:
    "무료 교육, 일 25,000원 수당, 월 253만원 인턴십. 서울 거주 만 18~39세 청년 대상. 3월 31일 마감. (사)하이서울기업협회",
  openGraph: {
    title: "2026 글로벌 이커머스 & 세일즈 기획 실무 과정",
    description:
      "교육비 0원 | 일 25,000원 수당 | 월 253만원 인턴십 | 모집 마감 3/31",
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
    <html lang="ko" className={notoSansKR.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
