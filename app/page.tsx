"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EmailForm from "@/components/email-form";
import ReplyOutput from "@/components/reply-output";
import { Sparkles, AlertCircle } from "lucide-react";

interface GeneratedReply {
  customerEmail: string;
  intent: string;
  subject: string;
  reply: string;
}

export default function Home() {
  const [generatedReply, setGeneratedReply] = useState<GeneratedReply | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleGenerate = async (data: { customerEmail: string; emailMessage: string; tone: string }) => {
    setIsLoading(true);
    setApiError("");
    setGeneratedReply(null);

    try {
      // Map emailMessage back to exactly what the AI API expects ("email")
      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.emailMessage, tone: data.tone }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || "Failed to generate reply. Please try again.");
        return;
      }

      setGeneratedReply({ ...result, customerEmail: data.customerEmail });
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setGeneratedReply(null);
    setApiError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-violet-950/20 dark:to-indigo-950/20">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-60 w-60 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-purple-400/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3" />
            AI-Powered Sales Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            AI Sales Reply Generator
          </h1>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Generate professional sales email replies instantly. Paste a customer
            email, pick a tone, and let AI craft the perfect response.
          </p>
        </header>

        {/* Main Card */}
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-xl shadow-violet-500/5">
          <CardHeader>
            <CardTitle className="text-lg">Compose Reply</CardTitle>
            <CardDescription>
              Paste the customer&apos;s email below and select your preferred
              reply tone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailForm
              onGenerate={handleGenerate}
              onClear={handleClear}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Error Display */}
        {apiError && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Something went wrong
              </p>
              <p className="text-sm text-destructive/80 mt-1">{apiError}</p>
            </div>
          </div>
        )}

        {/* Output Section */}
        {generatedReply && (
          <div className="mt-6">
            <Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-xl shadow-violet-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  Generated Reply
                </CardTitle>
                <CardDescription>
                  Your AI-crafted email reply is ready. Review and copy it below.
                </CardDescription>
              </CardHeader>
              <Separator className="mx-6 w-auto bg-border/50" />
              <CardContent className="pt-4">
                <ReplyOutput
                  customerEmail={generatedReply.customerEmail}
                  intent={generatedReply.intent}
                  subject={generatedReply.subject}
                  reply={generatedReply.reply}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="text-xs text-muted-foreground/60">
            Powered by OpenAI &middot; Built with Next.js &amp; shadcn/ui
          </p>
        </footer>
      </div>
    </div>
  );
}
