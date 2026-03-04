import Link from "next/link";
import { PROGRAM } from "@/lib/constants";
import { CheckCircle2, Phone, Mail, ArrowLeft } from "lucide-react";

export default function ApplySuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm md:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          신청이 완료되었습니다
        </h1>
        <p className="mb-8 text-gray-500">
          입력하신 정보가 정상적으로 접수되었습니다.
          <br />
          선발 결과는 {PROGRAM.resultDate}에 개별 통보됩니다.
        </p>

        <div className="mb-8 space-y-3 rounded-xl bg-gray-50 p-5 text-left">
          <h3 className="text-sm font-semibold text-gray-700">앞으로의 일정</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. 선발 면접: {PROGRAM.interviewDate}</p>
            <p>2. 결과 발표: {PROGRAM.resultDate} (이메일/문자)</p>
            <p>3. 교육 시작: {PROGRAM.startDate}</p>
          </div>
        </div>

        <div className="mb-8 space-y-2 text-sm text-gray-500">
          <p>문의사항이 있으시면 연락 바랍니다.</p>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{PROGRAM.contact.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{PROGRAM.contact.email}</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
