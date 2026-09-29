import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// TEMPORARY: open /api/health on your live site to see the real DB error.
// Delete this file once login works.
export async function GET() {
  const env = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    JWT_SECRET: !!process.env.JWT_SECRET,
  };
  try {
    await connectDB();
    return NextResponse.json({ ok: true, env });
  } catch (err) {
    return NextResponse.json(
      { ok: false, env, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
