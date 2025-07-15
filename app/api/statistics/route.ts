// app/api/statistics/route.ts
import { NextResponse } from "next/server";
import { getAllUrls } from "@/app/lib/urlStore";

export async function GET() {
  const data = getAllUrls();
  return NextResponse.json(data);
}
