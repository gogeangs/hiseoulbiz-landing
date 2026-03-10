import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { insertApplication, checkDuplicateEmail } from "@/lib/db";
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

    // 빈 문자열을 undefined로 변환 (optional 필드)
    if (body.birthDate === "") body.birthDate = undefined;
    if (body.district === "") body.district = undefined;

    const adminSchema = applicationSchema
      .omit({ privacyConsent: true })
      .extend({
        birthDate: applicationSchema.shape.birthDate.optional(),
        district: applicationSchema.shape.district.optional(),
      });

    const validated = adminSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "입력 정보를 확인해 주세요.", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    // 중복 이메일 체크
    const isDuplicate = await checkDuplicateEmail(validated.data.email);
    if (isDuplicate) {
      return NextResponse.json(
        { error: "이미 동일한 이메일로 신청한 내역이 있습니다." },
        { status: 409 }
      );
    }

    const submittedAt = new Date().toISOString();
    await insertApplication({
      ...validated.data,
      birthDate: validated.data.birthDate ?? "",
      district: (validated.data.district ?? "") as typeof validated.data.district & string,
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
