"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import QuotaBar from "@/components/status/quota-bar";
import GmailInbox from "@/components/gmail/gmail-inbox";
import EmailForm from "@/components/email/email-form";
import ReplyOutput from "@/components/reply/reply-output";
import { AlertCircle, Bot, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratedReply {
  customerEmail: string;
  intent: string;
  subject: string;
  reply: string;
}

interface SelectedEmail {
  id: string;
  sender: string;
  message: string;
}

export default function Home() {
  const [generatedReply, setGeneratedReply] = useState<GeneratedReply | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<SelectedEmail | null>(null);

  // Status lifted from Gmail component for the QuotaBar
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleGenerate = async (data: {
    customerEmail: string;
    emailMessage: string;
    tone: string;
  }) => {
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
    setSelectedEmail(null);
  };

  const handleSelectEmail = (id: string, sender: string, message: string) => {
    setSelectedEmail({ id, sender, message });
    setGeneratedReply(null);
    setApiError("");
  };

  const handleConnectionChange = (connected: boolean, count: number) => {
    setIsGmailConnected(connected);
    setUnreadCount(count);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/google/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <DashboardLayout
      headerRight={
        isGmailConnected && (
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )
      }
    >
      
      {/* Top API Status / Quota Bar */}
      <QuotaBar 
        isGmailConnected={isGmailConnected} 
        unreadCount={unreadCount} 
      />

      {/* 
        Main 3-Panel Layout 
        Desktop: 25% | 35% | 40% using explicit grid template columns 
        Tablet: Mobile-stacked inbox, split form & reply
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-[25%_35%_minmax(0,1fr)] gap-6 flex-1 min-h-[600px] pb-6 mt-2">
        
        {/* PANEL 1: Gmail Inbox */}
        {/* On mobile/tablet, it drops below the form area unless explicitly styled by grid rules */}
        <div className="order-3 lg:order-1 flex flex-col h-full h-[500px] lg:h-auto">
          <GmailInbox 
            onSelectEmail={(sender, snippet) => {
              const pseudoId = `${sender}::${snippet}`;
              handleSelectEmail(pseudoId, sender, snippet);
            }}
            selectedId={selectedEmail?.id ?? null}
            onConnectionChange={handleConnectionChange}
          />
        </div>

        {/* PANEL 2: Customer Input Form */}
        <div className="order-1 lg:order-2 flex flex-col h-full h-[600px] lg:h-auto">
          <EmailForm
            onGenerate={handleGenerate}
            onClear={handleClear}
            isLoading={isLoading}
            prefillEmail={selectedEmail?.sender ?? ""}
            prefillMessage={selectedEmail?.message ?? ""}
          />
        </div>

        {/* PANEL 3: AI Reply Output */}
        <div className="order-2 lg:order-3 flex flex-col h-full h-[600px] lg:h-auto">
          
          {/* Error Banner */}
          {apiError && (
            <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Generation Failed
                </h3>
                <p className="text-sm text-red-700/80 dark:text-red-400/80 mt-1">{apiError}</p>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex-1 animate-pulse flex flex-col gap-6">
               <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                 <div className="space-y-2">
                   <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                   <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded" />
                 </div>
               </div>
               <div className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
               <div className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
               <div className="flex-1 min-h-[200px] bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
            </div>
          ) : generatedReply ? (
            /* Output Panel */
            <ReplyOutput
              customerEmail={generatedReply.customerEmail}
              intent={generatedReply.intent}
              subject={generatedReply.subject}
              reply={generatedReply.reply}
            />
          ) : (
            /* Empty State */
            <div className="bg-slate-50/50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-5 mb-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <Bot className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                Ready to Generate
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Connect your Gmail or manually enter a customer message, then click generate.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
