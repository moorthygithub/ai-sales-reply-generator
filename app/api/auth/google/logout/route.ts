import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  
  // Clear the Google OAuth HTTP-only cookies
  response.cookies.delete("gmail_access_token");
  response.cookies.delete("gmail_refresh_token");
  
  return response;
}
