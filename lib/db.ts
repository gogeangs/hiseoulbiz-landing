import { neon } from "@neondatabase/serverless";
import type { ApplicationFormData } from "./validations";

function getSQL() {
  return neon(process.env.DATABASE_URL!);
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
}

export async function insertApplication(
  data: ApplicationFormData & { submittedAt: string }
) {
  const sql = getSQL();
  const { name, phone, email, birthDate, district, bonusTargets, submittedAt } =
    data;
  const targets =
    bonusTargets && bonusTargets.length > 0
      ? `{${bonusTargets.map((t) => `"${t}"`).join(",")}}`
      : null;
  await sql`
    INSERT INTO applications (name, phone, email, birth_date, district, bonus_targets, submitted_at)
    VALUES (${name}, ${phone}, ${email}, ${birthDate}, ${district}, ${targets}::text[], ${submittedAt})
  `;
}

export async function getApplications(options?: {
  search?: string;
  district?: string;
}): Promise<ApplicationRow[]> {
  const sql = getSQL();
  const { search, district } = options ?? {};

  if (search && district) {
    const pattern = `%${search}%`;
    const rows = await sql`
      SELECT * FROM applications
      WHERE district = ${district}
        AND (name ILIKE ${pattern} OR email ILIKE ${pattern} OR phone ILIKE ${pattern})
      ORDER BY submitted_at DESC
    `;
    return rows as ApplicationRow[];
  }

  if (search) {
    const pattern = `%${search}%`;
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

export async function getApplicationStats() {
  const sql = getSQL();
  const [totalResult, districtResult, todayResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM applications`,
    sql`SELECT district, COUNT(*) as count FROM applications GROUP BY district ORDER BY count DESC`,
    sql`SELECT COUNT(*) as count FROM applications WHERE submitted_at >= CURRENT_DATE`,
  ]);

  return {
    total: Number(totalResult[0].count),
    today: Number(todayResult[0].count),
    byDistrict: districtResult as unknown as {
      district: string;
      count: number;
    }[],
  };
}
