"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import IntentDisplay from "./intent-display";
import SubjectDisplay from "./subject-display";
import { Copy, Check, Send, Loader2, Bot, FileText } from "lucide-react";

interface ReplyOutputProps {
  customerEmail: string;
  intent: string;
  subject: string;
  reply: string;
}

export default function ReplyOutput({ customerEmail, intent, subject, reply }: ReplyOutputProps) {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleCopy = async () => {
    const text = `Subject: ${subject}\n\n${reply}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setSendError("");
    setSendSuccess(false);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerEmail,
          subject,
          text: reply,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSendError(result.error || "Failed to send email.");
        return;
      }

      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 5000);
    } catch {
      setSendError("Network error. Could not send email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center">
            <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              AI Output
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and send your generated reply
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        <IntentDisplay intent={intent} />
        <SubjectDisplay subject={subject} />

        <div className="space-y-2.5 flex-1 flex flex-col min-h-[150px]">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            Email Body
          </label>
          {/* Constrain height and scroll to match the SaaS look */}
          <ScrollArea className="flex-1 h-[250px] rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900 shadow-inner">
            <div className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-normal">
              {reply}
            </div>
          </ScrollArea>
        </div>
      </div>

      {sendError && (
        <p className="text-xs font-semibold text-red-500 dark:text-red-400 text-center mt-4 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/50">
          {sendError}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
        <Button
          onClick={handleSendEmail}
          disabled={isSending || sendSuccess}
          className={`flex-1 transition-all duration-300 font-medium h-10 shadow-sm ${
            sendSuccess 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
              : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 text-white dark:text-slate-900"
          }`}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : sendSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Sent
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </>
          )}
        </Button>

        <Button
          onClick={handleCopy}
          variant="outline"
          className={`flex-1 h-10 transition-all duration-300 font-medium ${
            copied
              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Output
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
