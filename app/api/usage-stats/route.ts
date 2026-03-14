import { NextResponse } from "next/server";
import { getUsageStats } from "@/lib/usage-tracker";

export async function GET() {
  return NextResponse.json(getUsageStats());
}
