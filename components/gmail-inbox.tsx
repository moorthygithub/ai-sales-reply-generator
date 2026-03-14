"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  RefreshCw,
  Loader2,
  Inbox,
  AlertCircle,
  ExternalLink,
  LogIn,
} from "lucide-react";

interface GmailMessage {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
}

interface GmailInboxProps {
  onSelectEmail: (sender: string, snippet: string) => void;
  selectedId: string | null;
}

export default function GmailInbox({ onSelectEmail, selectedId }: GmailInboxProps) {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gmail/messages");
      const data = await res.json();

      if (res.status === 401) {
        setIsAuthenticated(false);
        setMessages([]);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to fetch messages.");
        return;
      }

      setIsAuthenticated(data.authenticated);
      setMessages(data.messages ?? []);
    } catch {
      setError("Network error. Could not reach Gmail.");
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, []);

  // On mount, check if user is already authenticated
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Handle auth error from URL param (after redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (authError) {
      const messages: Record<string, string> = {
        access_denied: "Gmail access was denied.",
        no_code: "OAuth code was missing. Please try again.",
        token_exchange_failed: "Failed to connect Gmail. Please try again.",
      };
      setError(messages[authError] ?? "Gmail connection failed.");
      // Clean URL
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleConnectGmail = () => {
    window.location.href = "/api/auth/google/login";
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-sm">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Gmail Inbox
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAuthenticated ? `${messages.length} unread` : "Not connected"}
            </p>
          </div>
        </div>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchMessages}
            disabled={isLoading}
            className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Refresh inbox"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>

      <Separator className="bg-border/50" />

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Content Area */}
      {!isAuthenticated && hasFetched ? (
        /* Not Authenticated State */
        <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-8 gap-4">
          <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4">
            <LogIn className="h-8 w-8 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Connect your Gmail
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
              Sign in with Google to fetch your unread emails automatically.
            </p>
          </div>
          <Button
            onClick={handleConnectGmail}
            size="sm"
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 shadow-sm gap-2"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Connect Gmail
          </Button>
        </div>
      ) : isLoading && !hasFetched ? (
        /* Initial Loading State */
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-500">Loading inbox...</p>
        </div>
      ) : messages.length === 0 && isAuthenticated ? (
        /* Empty Inbox State */
        <div className="flex flex-col items-center justify-center flex-1 text-center px-4 gap-3">
          <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 p-4">
            <Inbox className="h-7 w-7 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            All caught up!
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No unread messages found.
          </p>
        </div>
      ) : (
        /* Message List */
        <ScrollArea className="flex-1 -mx-1">
          <div className="space-y-2 px-1 pb-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => onSelectEmail(msg.sender, msg.snippet)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 group ${
                  selectedId === msg.id
                    ? "border-indigo-400/60 bg-indigo-50/80 dark:bg-indigo-950/40 dark:border-indigo-500/40 shadow-sm"
                    : "border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-300/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Sender */}
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {msg.sender}
                    </p>
                    {/* Subject */}
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate mt-0.5">
                      {msg.subject}
                    </p>
                    {/* Snippet */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {msg.snippet}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {selectedId === msg.id && (
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-indigo-500 mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Footer — reconnect link */}
      {isAuthenticated && (
        <button
          onClick={handleConnectGmail}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-center hover:underline"
        >
          Switch Gmail account
        </button>
      )}
    </div>
  );
}
