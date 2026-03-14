"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ToneSelector from "./tone-selector";
import { Loader2, Mail, Edit3, RotateCcw } from "lucide-react";

interface EmailFormProps {
  onGenerate: (data: { customerEmail: string; emailMessage: string; tone: string }) => void;
  onClear: () => void;
  isLoading: boolean;
  prefillEmail?: string;
  prefillMessage?: string;
}

export default function EmailForm({
  onGenerate,
  onClear,
  isLoading,
  prefillEmail = "",
  prefillMessage = "",
}: EmailFormProps) {
  const [customerEmail, setCustomerEmail] = useState(prefillEmail);
  const [emailMessage, setEmailMessage] = useState(prefillMessage);
  const [tone, setTone] = useState("professional");
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefillEmail) setCustomerEmail(prefillEmail);
  }, [prefillEmail]);

  useEffect(() => {
    if (prefillMessage) setEmailMessage(prefillMessage);
  }, [prefillMessage]);

  const handleSubmit = () => {
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      setError("Please enter a valid customer email.");
      return;
    }
    if (!emailMessage.trim()) {
      setError("Please paste a customer message to generate a reply.");
      return;
    }
    setError("");
    onGenerate({ customerEmail, emailMessage, tone });
  };

  const handleClear = () => {
    setCustomerEmail("");
    setEmailMessage("");
    setTone("professional");
    setError("");
    onClear();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
      
      <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center">
          <Edit3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Compose Details
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Auto-filled from inbox, or enter manually
          </p>
        </div>
      </div>

      <div className="space-y-5 flex-1 flex flex-col">
        
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-slate-400" />
            Customer Email
          </label>
          <Input
            type="email"
            placeholder="customer@example.com"
            value={customerEmail}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
            className="bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Message Input */}
        <div className="space-y-1.5 flex-1 flex flex-col">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Customer Message
          </label>
          <Textarea
            placeholder="Paste the customer's message here, or select an email from the inbox…"
            value={emailMessage}
            onChange={(e) => {
              setEmailMessage(e.target.value);
              if (error) setError("");
            }}
            className="flex-1 min-h-[160px] resize-none bg-slate-50/50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 shadow-sm leading-relaxed text-sm p-3"
            disabled={isLoading}
          />
          {error && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-red-500 inline-block" />
              {error}
            </p>
          )}
        </div>

        {/* Tone Selector */}
        <ToneSelector value={tone} onChange={setTone} disabled={isLoading} />
        
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all font-medium h-10"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating AI Reply...
            </>
          ) : (
            "Generate AI Reply"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isLoading}
          className="sm:w-24 h-10 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4 text-slate-500" />
          Clear
        </Button>
      </div>
    </div>
  );
}
