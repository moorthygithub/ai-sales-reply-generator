import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { incrementAIRequest, addTokenUsage } from "@/lib/usage-tracker";

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

    const prompt = `You are an AI assistant designed ONLY to generate professional sales email replies.

Analyze the customer message and extract:
1. Customer Intent
2. Subject Line
3. Email Reply

Important Rules:
- Only generate replies for BUSINESS or SALES related inquiries.
- Examples: pricing, product details, demos, quotes, support, partnerships.
- Be polite and concise
- Encourage further conversation
- Keep it under 120 words
- Tone: ${selectedTone}

If the message is unrelated to business (e.g. jokes, personal advice, pets, weather, etc), Return:
- intent: "Non-business inquiry"
- subject: "Regarding Your Message"
- reply: "Thank you for reaching out. Please note that I am an AI assistant designed exclusively to handle business, product, or sales-related inquiries. I kindly ask that you send a relevant request so I can assist you properly."

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

    const usage = response.usageMetadata;
    const promptTokens = usage?.promptTokenCount || 0;
    const responseTokens = usage?.candidatesTokenCount || 0;
    const totalTokens = usage?.totalTokenCount || 0;
    
    incrementAIRequest();
    addTokenUsage(promptTokens, responseTokens, totalTokens);

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
