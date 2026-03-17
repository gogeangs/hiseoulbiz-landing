import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { updateApplication, deleteApplication, toggleCompleted, toggleSmsSent, toggleRejected, checkDuplicateEmail, getApplicationsByIds, updateMemo, updateContactStatus, resetEmailStatus } from "@/lib/db";
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

    // 빈 문자열을 undefined로 변환 (optional 필드)
    if (body.birthDate === "") body.birthDate = undefined;
    if (body.district === "") body.district = undefined;

    const adminSchema = applicationSchema
      .omit({ privacyConsent: true })
      .extend({
        name: applicationSchema.shape.name.min(1, "이름을 입력해 주세요."),
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

    // 메모 업데이트
    if (field === "memo") {
      const memo = (body as { memo?: string }).memo ?? "";
      const updated = await updateMemo(id, memo);
      if (!updated) {
        return NextResponse.json(
          { error: "해당 신청자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    // 연락 상태 업데이트
    if (field === "contact_status") {
      const status = (body as { status?: string }).status || null;
      const validStatuses = [null, "absent", "prospect"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "유효하지 않은 상태입니다." },
          { status: 400 }
        );
      }
      const updated = await updateContactStatus(id, status);
      if (!updated) {
        return NextResponse.json(
          { error: "해당 신청자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, contactStatus: status });
    }

    // 이메일 상태 초기화
    if (field === "email_reset") {
      const reset = await resetEmailStatus(id);
      if (!reset) {
        return NextResponse.json(
          { error: "해당 신청자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    // 탈락 토글
    if (field === "rejected") {
      const result = await toggleRejected(id);
      if (!result) {
        return NextResponse.json(
          { error: "해당 신청자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, rejected: result.rejected });
    }

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

    // 제출 완료 토글 — 토글 전 상태 확인 (재완료 시 이메일 중복 발송 방지)
    const beforeRows = await getApplicationsByIds([id]);
    const wasCompleted = beforeRows.length > 0 && beforeRows[0].completed_at !== null;

    const result = await toggleCompleted(id);
    if (!result) {
      return NextResponse.json(
        { error: "해당 신청자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 최초 제출 완료 시에만 확인 이메일 발송 (해제 후 재완료 시 미발송)
    if (result.completed && !wasCompleted && beforeRows.length > 0) {
      const app = beforeRows[0];
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
