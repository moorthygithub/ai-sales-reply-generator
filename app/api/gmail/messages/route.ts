import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client } from "@/lib/google-auth";
import { google } from "googleapis";

export interface GmailMessage {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
}

function getHeader(headers: { name?: string | null; value?: string | null }[], name: string): string {
  return headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken") || undefined;
  const maxResultsParam = searchParams.get("maxResults");
  const maxResults = maxResultsParam ? parseInt(maxResultsParam, 10) : 5;

  const accessToken = req.cookies.get("gmail_access_token")?.value;
  const refreshToken = req.cookies.get("gmail_refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ error: "Not authenticated", authenticated: false }, { status: 401 });
  }

  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch list of latest unread messages with pagination
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults,
      pageToken,
    });

    const messages = listRes.data.messages ?? [];
    const nextPageToken = listRes.data.nextPageToken;

    if (messages.length === 0) {
      return NextResponse.json({ messages: [], authenticated: true });
    }

    // Fetch full details for each message in parallel
    const detailedMessages = await Promise.all(
      messages.map(async (msg): Promise<GmailMessage> => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = detail.data.payload?.headers ?? [];
        const from = getHeader(headers, "From");
        const subject = getHeader(headers, "Subject");
        const snippet = detail.data.snippet ?? "";

        // Extract just the email address from "Name <email>" format
        const senderEmail = from.match(/<(.+)>/)?.[1] ?? from;

        return {
          id: msg.id!,
          sender: senderEmail,
          subject: subject || "(No Subject)",
          snippet: snippet,
        };
      })
    );

    // If token was refreshed, update cookie
    const response = NextResponse.json({ 
      messages: detailedMessages, 
      nextPageToken,
      authenticated: true 
    });
    const newCredentials = oauth2Client.credentials;
    if (newCredentials.access_token && newCredentials.access_token !== accessToken) {
      response.cookies.set("gmail_access_token", newCredentials.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (err: unknown) {
    console.error("Gmail API error:", err);

    // Check if it's an auth error (token expired and can't refresh)
    const status = (err as { status?: number })?.status;
    if (status === 401 || status === 403) {
      return NextResponse.json({ error: "Authentication expired. Please reconnect Gmail.", authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to fetch Gmail messages." }, { status: 500 });
  }
}
