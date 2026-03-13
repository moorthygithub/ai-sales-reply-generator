"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, Mail, FileText, Sparkles, Send, Loader2 } from "lucide-react";

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
      // Fallback for older browsers
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
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Intent Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          Customer Intent
        </div>
        <div className="rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-3">
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">{intent}</p>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Subject Line */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Mail className="h-4 w-4" />
          Subject Line
        </div>
        <div className="rounded-lg bg-gradient-to-r from-violet-500/5 to-indigo-500/5 border border-violet-500/10 p-3">
          <p className="text-sm font-medium text-foreground">{subject}</p>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Reply Body */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="h-4 w-4" />
          Email Reply
        </div>
        <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {reply}
          </p>
        </div>
      </div>

      {sendError && (
        <p className="text-sm text-destructive font-medium text-center">{sendError}</p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={handleSendEmail}
          disabled={isSending || sendSuccess}
          className={`flex-1 transition-all duration-300 ${
            sendSuccess 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
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
              Email Sent Successfully
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send to Customer
            </>
          )}
        </Button>

        <Button
          onClick={handleCopy}
          variant="outline"
          className={`flex-1 transition-all duration-300 ${
            copied
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/15"
              : "border-border/50 hover:bg-muted/50 hover:border-violet-500/30"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Reply
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
