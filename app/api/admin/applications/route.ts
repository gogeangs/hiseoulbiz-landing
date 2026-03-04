import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { insertApplication } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = applicationSchema
      .omit({ privacyConsent: true })
      .safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "입력 정보를 확인해 주세요.", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    await insertApplication({
      ...validated.data,
      submittedAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manual application insert error:", error);
    return NextResponse.json(
      { error: "등록에 실패했습니다." },
      { status: 500 }
    );
  }
}
