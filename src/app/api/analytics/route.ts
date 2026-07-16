import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (process.env.NODE_ENV !== "production" && payload?.name) {
    console.info("[analytics-disabled]", payload.name, payload.properties ?? {});
  }

  return NextResponse.json({ ok: true, adapter: "analytics-disabled" });
}
