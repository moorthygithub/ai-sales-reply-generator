import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, tone } = body;

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a customer email to generate a reply." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const selectedTone = tone || "professional";

    const prompt = `You are a professional sales assistant.

Write a clear and professional reply to the customer email.

Rules:
- Be polite and concise
- Address the customer's request
- Encourage further conversation
- Keep it under 120 words
- Tone: ${selectedTone}

Return exactly valid JSON in this format:
{
 "intent": "Brief description of the customer's intent",
 "subject": "Email subject",
 "reply": "Email body"
}

Customer Email:
${email}

Return ONLY valid JSON. Do not wrap in markdown code blocks.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    intent: { type: "STRING" },
                    subject: { type: "STRING" },
                    reply: { type: "STRING" }
                },
                required: ["intent", "subject", "reply"]
            }
        }
    });

    const content = response.text;

    if (!content) {
      return NextResponse.json(
        { error: "No response received from AI. Please try again." },
        { status: 500 }
      );
    }

    // Parse and validate JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from response if wrapped
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response. Please try again." },
          { status: 500 }
        );
      }
    }

    if (!parsed.subject || !parsed.reply) {
      return NextResponse.json(
        { error: "Invalid AI response format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
