import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { updateApplication, deleteApplication, toggleCompleted, toggleSmsSent, checkDuplicateEmail, getApplicationsByIds } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import { buildCompletionConfirmEmail } from "@/lib/email-template";
import { sendMail } from "@/lib/mailer";

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

    // 이메일 변경 시 중복 체크 (자기 자신 제외)
    const rows = await getApplicationsByIds([id]);
    if (rows.length > 0 && rows[0].email !== validated.data.email) {
      const isDuplicate = await checkDuplicateEmail(validated.data.email);
      if (isDuplicate) {
        return NextResponse.json(
          { error: "이미 동일한 이메일로 신청한 내역이 있습니다." },
          { status: 409 }
        );
      }
    }

    const updated = await updateApplication(id, {
      name: validated.data.name,
      phone: validated.data.phone,
      email: validated.data.email,
      birthDate: validated.data.birthDate || "",
      district: (validated.data.district || "") as string,
      bonusTargets: validated.data.bonusTargets,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "해당 신청자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application update error:", error);
    return NextResponse.json(
      { error: "수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body = await request.json().catch(() => ({}));
    const field = (body as { field?: string }).field;

    // SMS 토글
    if (field === "sms") {
      const smsResult = await toggleSmsSent(id);
      if (!smsResult) {
        return NextResponse.json(
          { error: "해당 신청자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, smsSent: smsResult.smsSent });
    }

    // 제출 완료 토글
    const result = await toggleCompleted(id);
    if (!result) {
      return NextResponse.json(
        { error: "해당 신청자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 제출 완료 체크 시 확인 이메일 발송
    if (result.completed) {
      const rows = await getApplicationsByIds([id]);
      if (rows.length > 0) {
        const app = rows[0];
        try {
          await sendMail({
            to: app.email,
            subject: `[하이서울기업협회] ${app.name}님, 서류 제출 확인 완료 안내`,
            html: buildCompletionConfirmEmail(app.name),
          });
        } catch (emailError) {
          console.error("Completion confirm email failed:", emailError);
        }
      }
    }

    return NextResponse.json({ success: true, completed: result.completed });
  } catch (error) {
    console.error("Application toggle complete error:", error);
    return NextResponse.json(
      { error: "처리에 실패했습니다." },
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
    const deleted = await deleteApplication(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "해당 신청자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application delete error:", error);
    return NextResponse.json(
      { error: "삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
