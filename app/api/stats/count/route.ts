import { NextResponse } from "next/server";
import { getApplicationStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getApplicationStats();
    return NextResponse.json({ count: stats.total });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
