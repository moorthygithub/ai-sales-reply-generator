"use client";

import EmailForm from "@/components/email-form";
import ReplyOutput from "@/components/reply-output";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Bot, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

interface GeneratedReply {
  customerEmail: string;
  intent: string;
  subject: string;
  reply: string;
}

export default function Home() {
  const [generatedReply, setGeneratedReply] = useState<GeneratedReply | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleGenerate = async (data: { customerEmail: string; emailMessage: string; tone: string }) => {
    setIsLoading(true);
    setApiError("");
    setGeneratedReply(null);

    try {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-purple-950/20" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6 shadow-sm ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-300/20 transition-all hover:scale-105">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Workflow</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            AI Sales Reply <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Empower your sales team. Provide the customer context, and let our AI craft the perfect, professional response in seconds.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6">
            <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-indigo-100/20 dark:shadow-none overflow-hidden transition-all duration-300">
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-500" />
                  Customer Input
                </CardTitle>
                <CardDescription className="text-sm">
                  Enter the details of the inquiry you received.
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
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
            
            {/* Error Message */}
            {apiError && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Generation Failed</h3>
                  <p className="text-sm text-red-700/80 dark:text-red-400/80 mt-1">{apiError}</p>
                </div>
              </div>
            )}

            {/* Success Output */}
            {generatedReply ? (
              <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-indigo-100/20 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/50 pb-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bot className="h-5 w-5 text-purple-500" />
                      AI Generated Response
                    </CardTitle>
                    <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                      Ready to send
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ReplyOutput
                    customerEmail={generatedReply.customerEmail}
                    intent={generatedReply.intent}
                    subject={generatedReply.subject}
                    reply={generatedReply.reply}
                  />
                </CardContent>
              </Card>
            ) : (
              /* Empty State Placeholder */
              <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent shadow-none h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                  <Bot className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No generated reply yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Fill out the form on the left and click &quot;Generate Reply&quot; to see the AI&apos;s personalized response appear here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex justify-center items-center gap-2">
            Built with Next.js &middot; Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
