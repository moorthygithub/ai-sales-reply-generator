"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Bot, Send, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export default function DocsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 lg:gap-8 mt-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div>
          <Badge variant="info" className="mb-3 px-3 py-1 text-xs">Documentation</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            AI Sales Reply Generator – User Guide
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg max-w-2xl">
            Learn how to seamlessly connect your Gmail, generate professional sales responses using Gemini AI, and track your daily API quotas.
          </p>
        </div>

        {/* Dashboard Screenshot */}
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
            <Image 
              src="/dashboard-screenshot.png"
              alt="SaaS Dashboard Interface"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        <Separator className="bg-slate-200 dark:bg-slate-800" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            {/* Section 1 */}
            <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/40 p-1.5 border border-red-100 dark:border-red-900/60">
                    <Mail className="h-4 w-4 text-red-500" />
                  </div>
                  <CardTitle className="text-lg">1. Connecting Gmail</CardTitle>
                </div>
                <CardDescription>Authorize access to read your unread inbox emails.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-700 dark:text-slate-300 marker:text-slate-400 marker:font-bold">
                  <li>Click <strong className="font-semibold text-slate-900 dark:text-white">"Connect Gmail"</strong> in the left pane of the dashboard.</li>
                  <li>In the Google popup, securely authorize your Google account.</li>
                  <li>Your inbox will sync automatically and display unread messages. Use the <strong className="font-semibold text-slate-900 dark:text-white">"Next/Previous"</strong> buttons to paginate through your inbox.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/40 p-1.5 border border-indigo-100 dark:border-indigo-900/60">
                    <Bot className="h-4 w-4 text-indigo-500" />
                  </div>
                  <CardTitle className="text-lg">2. Generating AI Replies</CardTitle>
                </div>
                <CardDescription>Use Gemini AI to craft professional sales-oriented replies.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-700 dark:text-slate-300 marker:text-slate-400 marker:font-bold">
                  <li>Select an email from the left inbox (it will highlight and autofill the center pane).</li>
                  <li>Choose your desired <strong className="font-semibold text-slate-900 dark:text-white">Reply Tone</strong> (e.g. Professional, Friendly).</li>
                  <li>Click <strong className="font-semibold text-indigo-600 dark:text-indigo-400">"Generate AI Reply"</strong>. The AI strictly processes <strong className="font-semibold">business/sales inquiries</strong> and detects customer intent dynamically.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/40 p-1.5 border border-emerald-100 dark:border-emerald-900/60">
                    <Send className="h-4 w-4 text-emerald-500" />
                  </div>
                  <CardTitle className="text-lg">3. Sending Emails</CardTitle>
                </div>
                <CardDescription>Review and instantly dispatch generated responses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-700 dark:text-slate-300 marker:text-slate-400 marker:font-bold">
                  <li>Review the generated Subject Line and Body in the right pane.</li>
                  <li>Click <strong className="font-semibold text-slate-900 dark:text-white">"Copy Output"</strong> if you wish to paste it elsewhere.</li>
                  <li>Click <strong className="font-semibold text-slate-900 dark:text-white">"Send Email"</strong> to directly dispatch the message via Nodemailer using your configured SMTP credentials.</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Features Widget */}
            <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-indigo-50/30 dark:bg-indigo-950/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-500" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" /> Gmail Integration
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" /> AI Tone Customization
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" /> Direct Email Dispatch
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" /> Live Daily Quota Tracking
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
