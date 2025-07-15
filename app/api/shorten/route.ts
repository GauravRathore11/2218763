// app/api/shorten/route.ts
import { NextRequest, NextResponse } from "next/server";
import { saveUrl, getUrl } from "@/app/lib/urlStore";

export async function POST(req: NextRequest) {
  const { longUrl, validityMinutes, shortcode } = await req.json();

  if (!longUrl) {
    return NextResponse.json({ error: "longUrl is required" }, { status: 400 });
  }

  const code = shortcode || Math.random().toString(36).substring(2, 8);
  if (getUrl(code)) {
    return NextResponse.json({ error: "Shortcode already exists" }, { status: 409 });
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + (validityMinutes || 30) * 60000);

  saveUrl({
    longUrl,
    shortcode: code,
    createdAt: now.toISOString(),
    expiresAt: expiry.toISOString(),
    clicks: [],
  });

  return NextResponse.json({
    shortUrl: `http://localhost:3000/${code}`,
    expiryTime: expiry.toISOString(),
  });
}
