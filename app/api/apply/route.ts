import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/validations";
import { insertApplication } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 서버 사이드 유효성 검증
    const validated = applicationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "입력 정보를 확인해 주세요.", details: validated.error.flatten() },
        { status: 400 }
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "제출에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
