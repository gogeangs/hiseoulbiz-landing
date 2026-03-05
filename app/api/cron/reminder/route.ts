import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getUncompletedApplications } from "@/lib/db";
import { buildReminderEmail } from "@/lib/email-template";
import { DEADLINE_ISO } from "@/lib/constants";

const REMINDER_DAYS = [10, 5, 3, 1];

export async function GET(request: NextRequest) {
  // Vercel Cron 인증
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  // 마감일까지 남은 일수 계산 (KST 기준)
  const now = new Date();
  const kstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const deadline = new Date(DEADLINE_ISO);
  const kstDeadline = new Date(deadline.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

  const diffMs = kstDeadline.setHours(0, 0, 0, 0) - kstNow.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // 리마인드 대상 날짜가 아니면 스킵
  if (!REMINDER_DAYS.includes(daysLeft)) {
    return NextResponse.json({ message: `D-${daysLeft}, 리마인드 대상 아님`, sent: 0 });
  }

  try {
    const applications = await getUncompletedApplications();
    if (applications.length === 0) {
      return NextResponse.json({ message: "미제출자 없음", sent: 0 });
    }

    const resend = new Resend(resendApiKey);
    let sent = 0;
    let failed = 0;

    // 5건씩 배치 발송
    const BATCH_SIZE = 5;
    for (let i = 0; i < applications.length; i += BATCH_SIZE) {
      const batch = applications.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((app) =>
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "하이서울기업협회 <onboarding@resend.dev>",
            to: app.email,
            subject: `[하이서울기업협회] 서류 제출 마감 D-${daysLeft} 안내`,
            html: buildReminderEmail(app.name, daysLeft),
          })
        )
      );

      for (const r of results) {
        if (r.status === "fulfilled") sent++;
        else {
          failed++;
          console.error("Reminder email failed:", r.reason);
        }
      }
    }

    return NextResponse.json({
      message: `D-${daysLeft} 리마인드 발송 완료`,
      sent,
      failed,
      total: applications.length,
    });
  } catch (error) {
    console.error("Reminder cron error:", error);
    return NextResponse.json({ error: "리마인드 발송 실패" }, { status: 500 });
  }
}
