import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/validations";

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

    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      console.error("GAS_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "서버 설정 오류입니다. 관리자에게 문의해 주세요." },
        { status: 500 }
      );
    }

    // Google Apps Script로 전달
    const gasResponse = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validated.data,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!gasResponse.ok) {
      throw new Error("Google Apps Script 응답 오류");
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
