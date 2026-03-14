import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { incrementEmailSent } from "@/lib/usage-tracker";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, text } = body;

    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: "Missing required fields (to, subject, text)." },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: "Email credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);

    incrementEmailSent();

    return NextResponse.json({ success: true, message: "Email sent successfully." });
  } catch (error: unknown) {
    console.error("Email Sending Error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
