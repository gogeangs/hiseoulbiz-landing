import { neon } from "@neondatabase/serverless";
import type { ApplicationFormData } from "./validations";

export class DuplicateEmailError extends Error {
  constructor() {
    super("이미 동일한 이메일로 신청한 내역이 있습니다.");
    this.name = "DuplicateEmailError";
  }
}

function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export interface ApplicationRow {
  id: number;
  name: string;
  phone: string;
  email: string;
  birth_date: string;
  district: string;
  bonus_targets: string[] | null;
  submitted_at: string;
  email_sent_at: string | null;
  email_error: string | null;
  sms_sent_at: string | null;
  sms_error: string | null;
  completed_at: string | null;
}

export async function insertApplication(
  data: Omit<ApplicationFormData, "privacyConsent"> & { submittedAt: string }
): Promise<number> {
  const sql = getSQL();
  const { name, phone, email, birthDate, district, bonusTargets, submittedAt } =
    data;
  // JSON으로 변환 후 Postgres에서 파싱 — SQL 인젝션 방지
  const targets =
    bonusTargets && bonusTargets.length > 0
      ? JSON.stringify(bonusTargets)
      : null;
  try {
    const rows = await sql`
      INSERT INTO applications (name, phone, email, birth_date, district, bonus_targets, submitted_at)
      VALUES (${name}, ${phone}, ${email}, ${birthDate}, ${district},
        CASE WHEN ${targets}::text IS NOT NULL
          THEN ARRAY(SELECT jsonb_array_elements_text(${targets}::jsonb))
          ELSE NULL
        END,
        ${submittedAt})
      RETURNING id
    `;
    return rows[0].id as number;
  } catch (error: unknown) {
    // UNIQUE 제약 위반 (이메일 중복)
    if (error instanceof Error && error.message.includes("idx_applications_email_unique")) {
      throw new DuplicateEmailError();
    }
    throw error;
  }
}

function escapeILIKE(str: string): string {
  return str.replace(/[%_\\]/g, "\\$&");
}

export async function getApplications(options?: {
  search?: string;
  district?: string;
}): Promise<ApplicationRow[]> {
  const sql = getSQL();
  const { search, district } = options ?? {};

  if (search && district) {
    const pattern = `%${escapeILIKE(search)}%`;
    const rows = await sql`
      SELECT * FROM applications
      WHERE district = ${district}
        AND (name ILIKE ${pattern} OR email ILIKE ${pattern} OR phone ILIKE ${pattern})
      ORDER BY submitted_at DESC
    `;
    return rows as ApplicationRow[];
  }

  if (search) {
    const pattern = `%${escapeILIKE(search)}%`;
    const rows = await sql`
      SELECT * FROM applications
      WHERE name ILIKE ${pattern} OR email ILIKE ${pattern} OR phone ILIKE ${pattern}
      ORDER BY submitted_at DESC
    `;
    return rows as ApplicationRow[];
  }

  if (district) {
    const rows = await sql`
      SELECT * FROM applications
      WHERE district = ${district}
      ORDER BY submitted_at DESC
    `;
    return rows as ApplicationRow[];
  }

  const rows = await sql`
    SELECT * FROM applications
    ORDER BY submitted_at DESC
  `;
  return rows as ApplicationRow[];
}

export async function getApplicationsByIds(
  ids: number[]
): Promise<ApplicationRow[]> {
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM applications WHERE id = ANY(${ids})
  `;
  return rows as ApplicationRow[];
}

export async function markEmailSent(ids: number[]): Promise<void> {
  const sql = getSQL();
  await sql`
    UPDATE applications SET email_sent_at = NOW(), email_error = NULL WHERE id = ANY(${ids})
  `;
}

export async function markEmailFailed(ids: number[], error: string): Promise<void> {
  const sql = getSQL();
  await sql`
    UPDATE applications SET email_error = ${error} WHERE id = ANY(${ids})
  `;
}

export async function checkDuplicateEmail(email: string): Promise<boolean> {
  const sql = getSQL();
  const rows = await sql`
    SELECT 1 FROM applications WHERE email = ${email} LIMIT 1
  `;
  return rows.length > 0;
}

export async function updateApplication(
  id: number,
  data: { name: string; phone: string; email: string; birthDate?: string; district?: string; bonusTargets?: string[] }
): Promise<boolean> {
  const sql = getSQL();
  const targets =
    data.bonusTargets && data.bonusTargets.length > 0
      ? JSON.stringify(data.bonusTargets)
      : null;
  const rows = await sql`
    UPDATE applications
    SET name = ${data.name},
        phone = ${data.phone},
        email = ${data.email},
        birth_date = ${data.birthDate || ""},
        district = ${data.district || ""},
        bonus_targets = CASE WHEN ${targets}::text IS NOT NULL
          THEN ARRAY(SELECT jsonb_array_elements_text(${targets}::jsonb))
          ELSE NULL
        END
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteApplication(id: number): Promise<boolean> {
  const sql = getSQL();
  const rows = await sql`DELETE FROM applications WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function toggleCompleted(id: number): Promise<{ completed: boolean } | null> {
  const sql = getSQL();
  const rows = await sql`
    UPDATE applications
    SET completed_at = CASE WHEN completed_at IS NULL THEN NOW() ELSE NULL END
    WHERE id = ${id}
    RETURNING completed_at
  `;
  if (rows.length === 0) return null;
  return { completed: rows[0].completed_at !== null };
}

export async function getUncompletedApplications(): Promise<ApplicationRow[]> {
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM applications
    WHERE completed_at IS NULL AND email_sent_at IS NOT NULL
    ORDER BY submitted_at DESC
  `;
  return rows as ApplicationRow[];
}

export async function toggleSmsSent(id: number): Promise<{ smsSent: boolean } | null> {
  const sql = getSQL();
  const rows = await sql`
    UPDATE applications
    SET sms_sent_at = CASE WHEN sms_sent_at IS NULL THEN NOW() ELSE NULL END,
        sms_error = NULL
    WHERE id = ${id}
    RETURNING sms_sent_at
  `;
  if (rows.length === 0) return null;
  return { smsSent: rows[0].sms_sent_at !== null };
}

export async function getApplicationStats() {
  const sql = getSQL();
  const [totalResult, todayResult, completedResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM applications`,
    sql`SELECT COUNT(*) as count FROM applications WHERE submitted_at >= (NOW() AT TIME ZONE 'Asia/Seoul')::date`,
    sql`SELECT COUNT(*) as count FROM applications WHERE completed_at IS NOT NULL`,
  ]);

  return {
    total: Number(totalResult[0].count),
    today: Number(todayResult[0].count),
    completed: Number(completedResult[0].count),
  };
}
