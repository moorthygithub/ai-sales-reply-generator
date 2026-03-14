"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";

interface EmailFormProps {
  onGenerate: (data: { customerEmail: string; emailMessage: string; tone: string }) => void;
  onClear: () => void;
  isLoading: boolean;
  prefillEmail?: string;
  prefillMessage?: string;
}

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "short", label: "Short" },
];

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
      setError("Please enter a valid customer email address.");
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
    <div className="space-y-5">
      {/* Customer Email Address */}
      <div className="space-y-2">
        <label htmlFor="customer-email" className="text-sm font-medium text-foreground">
          Customer Email Address
        </label>
        <input
          type="email"
          id="customer-email"
          placeholder="customer@example.com"
          value={customerEmail}
          onChange={(e) => {
            setCustomerEmail(e.target.value);
            if (error) setError("");
          }}
          className="flex h-9 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        />
      </div>

      {/* Customer Message */}
      <div className="space-y-2">
        <label htmlFor="customer-message" className="text-sm font-medium text-foreground">
          Customer Message
        </label>
        <Textarea
          id="customer-message"
          placeholder="Paste the customer's message here, or select an email from the inbox…"
          value={emailMessage}
          onChange={(e) => {
            setEmailMessage(e.target.value);
            if (error) setError("");
          }}
          rows={7}
          className="resize-none bg-muted/30 border-border/50 focus:border-primary/50 transition-colors"
          disabled={isLoading}
        />
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1.5">
            <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
            {error}
          </p>
        )}
      </div>

      {/* Tone Selector */}
      <div className="space-y-2">
        <label htmlFor="tone-select" className="text-sm font-medium text-foreground">
          Reply Tone
        </label>
        <Select value={tone} onValueChange={setTone} disabled={isLoading}>
          <SelectTrigger id="tone-select" className="bg-muted/30 border-border/50">
            <SelectValue placeholder="Select a tone" />
          </SelectTrigger>
          <SelectContent>
            {tones.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-1">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.99]"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles />
              Generate Reply
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isLoading}
          size="lg"
          className="border-border/50 hover:bg-muted/50 transition-all duration-300"
        >
          <RotateCcw />
          Clear
        </Button>
      </div>
    </div>
  );
}
