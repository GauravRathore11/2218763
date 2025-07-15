// app/api/resolve/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUrl } from "@/app/lib/urlStore";

export async function GET(_: NextRequest, { params }: { params: { code: string } }) {
  const data = getUrl(params.code);

  if (!data) {
    return NextResponse.json({ error: "Shortcode not found" }, { status: 404 });
  }

  const now = new Date();
  const expires = new Date(data.expiresAt);
  if (now > expires) {
    return NextResponse.json({ error: "Link expired" }, { status: 410 });
  }

  data.clicks.push({ timestamp: now.toISOString(), location: "Unknown" }); // Optional
  return NextResponse.json({ longUrl: data.longUrl });
}
