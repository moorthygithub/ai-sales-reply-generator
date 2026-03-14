import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-auth";

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Google OAuth credentials are not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local" },
      { status: 500 }
    );
  }

  const authUrl = getAuthUrl();
  return NextResponse.redirect(authUrl);
}
