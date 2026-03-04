import { neon } from "@neondatabase/serverless";

async function initDb() {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(20) NOT NULL,
      phone         VARCHAR(20) NOT NULL,
      email         VARCHAR(100) NOT NULL,
      birth_date    VARCHAR(20) NOT NULL,
      district      VARCHAR(10) NOT NULL,
      bonus_targets TEXT[],
      submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      email_sent_at TIMESTAMPTZ DEFAULT NULL
    )
  `;

  // 기존 테이블에 컬럼 추가 (이미 있으면 무시)
  await sql`
    ALTER TABLE applications
    ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ DEFAULT NULL
  `;

  // 이메일 유니크 제약 (중복 신청 방지)
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_email_unique ON applications(email)`;

  await sql`CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_applications_district ON applications(district)`;

  console.log("Database initialized successfully.");
}

initDb().catch(console.error);
