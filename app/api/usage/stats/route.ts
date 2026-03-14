import { NextResponse } from "next/server";
import { getUsageStats } from "@/lib/usage-tracker";

export async function GET() {
  const stats = getUsageStats();
  return NextResponse.json(stats);
}
