import Link from "next/link";
import { PROGRAM } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | (사)하이서울기업협회",
  description: "2026 글로벌 이커머스 & 세일즈 기획 실무 과정 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            메인으로
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold text-primary-900 md:text-3xl">
          개인정보처리방침
        </h1>

        <div className="space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          {/* 1. 총칙 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              1. 총칙
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {PROGRAM.organizer}(이하 &quot;협회&quot;)는 「개인정보 보호법」
              제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을
              신속하고 원활하게 처리하기 위하여 다음과 같이
              개인정보처리방침을 수립·공개합니다.
            </p>
          </section>

          {/* 2. 수집 항목 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              2. 수집하는 개인정보 항목
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              협회는 교육생 선발을 위해 아래 개인정보를 수집합니다.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      구분
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      항목
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-700">
                      필수 항목
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      이름, 휴대전화번호, 이메일, 생년월일, 서울시 거주 지역(구)
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-700">
                      선택 항목
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      가점 대상 해당 여부(장애인, 여성세대주,
                      취업지원대상자, 결혼이주자, 북한이탈주민 등)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. 수집·이용 목적 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              3. 개인정보의 수집·이용 목적
            </h2>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600">
              <li>
                &quot;{PROGRAM.title}&quot; 교육생 선발(자격 확인, 면접 안내, 결과 통보)
              </li>
              <li>교육 운영 및 출석 관리</li>
              <li>교육 수당 및 인턴 급여 지급</li>
              <li>가점 대상 해당 여부 확인</li>
            </ul>
          </section>

          {/* 4. 보유 기간 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              4. 개인정보의 보유 및 이용 기간
            </h2>
            <p className="mb-2 text-sm leading-relaxed text-gray-600">
              수집된 개인정보는 교육 사업 종료 후 <strong>1년간</strong> 보유하며,
              보유 기간 경과 시 지체 없이 파기합니다. 다만, 관련 법령에 따라
              보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-700">관련 법령에 따른 보존</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  계약 또는 청약철회에 관한 기록: 5년 (전자상거래법)
                </li>
                <li>
                  소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)
                </li>
              </ul>
            </div>
          </section>

          {/* 5. 제3자 제공 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              5. 개인정보의 제3자 제공
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              협회는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지
              않습니다. 다만, 서울특별시 및 관련 사업 주관기관에 사업 실적
              보고 목적으로 제공될 수 있으며, 이 경우 관련 법령에 따라
              처리합니다.
            </p>
          </section>

          {/* 6. 파기 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              6. 개인정보의 파기
            </h2>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600">
              <li>
                <strong>전자적 파일:</strong> 복원이 불가능한 방법으로 영구 삭제
              </li>
              <li>
                <strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각하여 파기
              </li>
            </ul>
          </section>

          {/* 7. 정보주체 권리 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              7. 정보주체의 권리·의무 및 행사 방법
            </h2>
            <p className="mb-2 text-sm leading-relaxed text-gray-600">
              정보주체는 언제든지 다음 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              위 권리 행사는 아래 담당자에게 전화, 이메일로 요청하시면
              지체 없이 조치하겠습니다.
            </p>
          </section>

          {/* 8. 안전성 확보 조치 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              8. 개인정보의 안전성 확보 조치
            </h2>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600">
              <li>개인정보 접근 권한 제한 및 관리</li>
              <li>개인정보의 암호화 처리</li>
              <li>접속 기록의 보관 및 위·변조 방지</li>
            </ul>
          </section>

          {/* 9. 담당자 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              9. 개인정보 보호 담당자
            </h2>
            <div className="rounded-xl bg-primary-50 p-5">
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">소속:</span>{" "}
                  {PROGRAM.organizer} {PROGRAM.contact.department}
                </p>
                <p>
                  <span className="font-medium">전화:</span>{" "}
                  <a
                    href={`tel:${PROGRAM.contact.phone}`}
                    className="text-primary-700 underline underline-offset-2"
                  >
                    {PROGRAM.contact.phone}
                  </a>
                </p>
                <p>
                  <span className="font-medium">이메일:</span>{" "}
                  <a
                    href={`mailto:${PROGRAM.contact.email}`}
                    className="text-primary-700 underline underline-offset-2"
                  >
                    {PROGRAM.contact.email}
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* 10. 시행일 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-primary-900">
              10. 시행일
            </h2>
            <p className="text-sm text-gray-600">
              이 개인정보처리방침은 <strong>2026년 3월 1일</strong>부터
              시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
