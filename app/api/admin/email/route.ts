import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";
import { verifyAdminToken } from "@/lib/auth";
import { getApplicationsByIds, markEmailSent, markEmailFailed, markSmsSent, markSmsFailed } from "@/lib/db";
import { buildApplicationGuideEmail } from "@/lib/email-template";
import { sendSms } from "@/lib/sms";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(apiKey);
}

// 첨부파일 모듈 레벨 캐시 (매 요청마다 디스크 I/O 방지)
let cachedFileContent: Buffer | null = null;
async function getAttachmentFile(): Promise<Buffer> {
  if (cachedFileContent) return cachedFileContent;
  const filePath = path.join(process.cwd(), "public/files/2026매력일자리_참여신청서.hwp");
  cachedFileContent = await readFile(filePath);
  return cachedFileContent;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const { applicationIds } = await request.json();
    if (
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0 ||
      applicationIds.length > 100 ||
      !applicationIds.every((id: unknown) => Number.isInteger(id) && (id as number) > 0)
    ) {
      return NextResponse.json(
        { error: "발송 대상을 선택해 주세요." },
        { status: 400 }
      );
    }

    const applications = await getApplicationsByIds(applicationIds);
    if (applications.length === 0) {
      return NextResponse.json(
        { error: "유효한 신청 데이터가 없습니다." },
        { status: 404 }
      );
    }

    const resend = getResend();

    // 신청서 파일 읽기 (캐시)
    const fileContent = await getAttachmentFile();

    const results: { id: number; success: boolean; error?: string }[] = [];

    // 5건씩 병렬 발송 (Vercel 타임아웃 방지)
    const BATCH_SIZE = 5;
    for (let i = 0; i < applications.length; i += BATCH_SIZE) {
      const batch = applications.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map(async (app) => {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "하이서울기업협회 <onboarding@resend.dev>",
            to: app.email,
            subject: `[하이서울기업협회] ${app.name}님, 신청 접수 확인 및 신청서 안내`,
            html: buildApplicationGuideEmail(app.name),
            attachments: [
              {
                filename: "2026매력일자리_참여신청서.hwp",
                content: fileContent,
              },
            ],
          });
          // 이메일 발송 성공 시 SMS도 발송
          const smsResult = await sendSms({ receiver: app.phone, name: app.name });
          if (smsResult.success) {
            await markSmsSent([app.id]);
          } else {
            console.error(`SMS failed for ID ${app.id}:`, smsResult.error);
            await markSmsFailed([app.id], smsResult.error || "발송 실패").catch(() => {});
          }
          return app.id;
        })
      );

      for (let j = 0; j < batchResults.length; j++) {
        const r = batchResults[j];
        const app = batch[j];
        if (r.status === "fulfilled") {
          results.push({ id: app.id, success: true });
        } else {
          console.error(`Email failed for ID ${app.id}:`, r.reason);
          results.push({
            id: app.id,
            success: false,
            error: r.reason instanceof Error ? r.reason.message : "발송 실패",
          });
        }
      }
    }

    const sentIds = results.filter((r) => r.success).map((r) => r.id);
    const failedResults = results.filter((r) => !r.success);

    if (sentIds.length > 0) {
      await markEmailSent(sentIds);
    }
    if (failedResults.length > 0) {
      const failedIds = failedResults.map((r) => r.id);
      await markEmailFailed(failedIds, failedResults[0].error || "발송 실패");
    }

    return NextResponse.json({
      sent: sentIds.length,
      failed: failedResults.length,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "이메일 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
