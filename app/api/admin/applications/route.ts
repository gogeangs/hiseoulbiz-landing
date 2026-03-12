import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/auth";
import { insertApplication, checkDuplicateEmail } from "@/lib/db";
import { SEOUL_DISTRICTS } from "@/lib/validations";
import { BONUS_TARGETS } from "@/lib/constants";

const adminSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(20, "이름은 20자 이내로 입력해 주세요."),
  phone: z.string().trim().regex(/^01[016789]-?\d{3,4}-?\d{4}$/, "올바른 휴대전화 번호를 입력해 주세요."),
  email: z.string().trim().toLowerCase().email("올바른 이메일 주소를 입력해 주세요."),
  birthDate: z.string().optional().default(""),
  district: z.string().optional().default(""),
  bonusTargets: z.array(z.enum(BONUS_TARGETS as unknown as readonly [string, ...string[]])).optional(),
});

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

    const validated = adminSchema.safeParse(body);

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0];
      return NextResponse.json(
        { error: firstError || "입력 정보를 확인해 주세요." },
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
      district: validated.data.district as typeof SEOUL_DISTRICTS[number] | "",
      submittedAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Manual application insert error:", errMsg, error);
    return NextResponse.json(
      { error: `등록에 실패했습니다: ${errMsg}` },
      { status: 500 }
    );
  }
}
