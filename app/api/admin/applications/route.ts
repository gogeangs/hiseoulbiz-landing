import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { insertApplication } from "@/lib/db";
import { SEOUL_DISTRICTS } from "@/lib/validations";

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
    const { name, phone, email, birthDate, district, bonusTargets } = body;

    if (!name || !phone || !email || !birthDate || !district) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    if (!SEOUL_DISTRICTS.includes(district)) {
      return NextResponse.json(
        { error: "유효하지 않은 지역입니다." },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    await insertApplication({
      name,
      phone,
      email,
      birthDate,
      district,
      bonusTargets: bonusTargets ?? [],
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
