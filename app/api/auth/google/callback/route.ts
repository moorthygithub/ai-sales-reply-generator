import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client } from "@/lib/google-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?auth_error=access_denied", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=no_code", req.url));
  }

  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    const response = NextResponse.redirect(new URL("/", req.url));

    // Store tokens in HTTP-only cookies (7-day expiry)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    };

    if (tokens.access_token) {
      response.cookies.set("gmail_access_token", tokens.access_token, cookieOptions);
    }
    if (tokens.refresh_token) {
      response.cookies.set("gmail_refresh_token", tokens.refresh_token, cookieOptions);
    }

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(new URL("/?auth_error=token_exchange_failed", req.url));
  }
}
