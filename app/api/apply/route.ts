import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";
import { applicationSchema } from "@/lib/validations";
import { insertApplication, DuplicateEmailError, checkDuplicateEmail, markEmailSent } from "@/lib/db";
import { DEADLINE_ISO } from "@/lib/constants";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildApplicationGuideEmail } from "@/lib/email-template";

// 첨부파일 모듈 레벨 캐시
let cachedFileContent: Buffer | null = null;
async function getAttachmentFile(): Promise<Buffer> {
  if (cachedFileContent) return cachedFileContent;
  const filePath = path.join(process.cwd(), "public/files/2026매력일자리_참여신청서.hwp");
  cachedFileContent = await readFile(filePath);
  return cachedFileContent;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: IP당 1분에 5회
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(`apply:${ip}`, { maxRequests: 5, windowMs: 60_000 })) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    // 마감일 서버 사이드 체크
    if (new Date() > new Date(DEADLINE_ISO)) {
      return NextResponse.json(
        { error: "신청 기간이 마감되었습니다." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // 서버 사이드 유효성 검증
    const validated = applicationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "입력 정보를 확인해 주세요.", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    // 중복 신청 체크 (이메일 기준)
    const isDuplicate = await checkDuplicateEmail(validated.data.email);
    if (isDuplicate) {
      return NextResponse.json(
        { error: "이미 동일한 이메일로 신청한 내역이 있습니다." },
        { status: 409 }
      );
    }

    const submittedAt = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privacyConsent: _consent, ...formData } = validated.data;

    // Dual write: DB + GAS (병렬 처리)
    const dbPromise = insertApplication({ ...formData, submittedAt });

    const gasUrl = process.env.GAS_WEBHOOK_URL;
    const gasPromise = gasUrl
      ? fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, submittedAt }),
        })
      : Promise.resolve(null);

    const [dbResult, gasResult] = await Promise.allSettled([
      dbPromise,
      gasPromise,
    ]);

    // DB 저장 실패 시 에러 반환
    if (dbResult.status === "rejected") {
      if (dbResult.reason instanceof DuplicateEmailError) {
        return NextResponse.json(
          { error: "이미 동일한 이메일로 신청한 내역이 있습니다." },
          { status: 409 }
        );
      }
      console.error("DB insert failed:", dbResult.reason);
      return NextResponse.json(
        { error: "제출에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    // GAS 실패는 로그만 남김 (DB가 primary)
    if (gasResult.status === "rejected") {
      console.error("GAS webhook failed:", gasResult.reason);
    }

    // 자동 이메일 발송 (실패해도 신청 성공 응답에 영향 없음)
    const insertedId = dbResult.value;
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fileContent = await getAttachmentFile();
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "하이서울기업협회 <onboarding@resend.dev>",
          to: formData.email,
          subject: `[하이서울기업협회] ${formData.name}님, 신청 접수 확인 및 신청서 안내`,
          html: buildApplicationGuideEmail(formData.name),
          attachments: [
            {
              filename: "2026매력일자리_참여신청서.hwp",
              content: fileContent,
            },
          ],
        });
        await markEmailSent([insertedId]);
      } catch (emailError) {
        console.error("Auto email send failed:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "제출에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
