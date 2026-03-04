import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { updateApplication, deleteApplication } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";

function getIdFromParams(params: { id: string }): number | null {
  const id = Number(params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const { id: idStr } = await params;
  const id = getIdFromParams({ id: idStr });
  if (!id) {
    return NextResponse.json(
      { error: "유효하지 않은 ID입니다." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const adminSchema = applicationSchema
      .omit({ privacyConsent: true })
      .extend({
        birthDate: applicationSchema.shape.birthDate.optional().default(""),
        district: applicationSchema.shape.district.optional().default("" as never),
      });

    const validated = adminSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "입력 정보를 확인해 주세요.", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    await updateApplication(id, {
      name: validated.data.name,
      phone: validated.data.phone,
      email: validated.data.email,
      birthDate: validated.data.birthDate || "",
      district: (validated.data.district || "") as string,
      bonusTargets: validated.data.bonusTargets,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application update error:", error);
    return NextResponse.json(
      { error: "수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const { id: idStr } = await params;
  const id = getIdFromParams({ id: idStr });
  if (!id) {
    return NextResponse.json(
      { error: "유효하지 않은 ID입니다." },
      { status: 400 }
    );
  }

  try {
    await deleteApplication(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application delete error:", error);
    return NextResponse.json(
      { error: "삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
