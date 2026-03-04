import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 | 신청 현황",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
