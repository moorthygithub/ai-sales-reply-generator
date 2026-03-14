"use client";

import { useEffect, useState, useCallback } from "react";
import EmailItem from "./email-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Loader2, Inbox, AlertCircle, ExternalLink, LogIn, ChevronLeft, ChevronRight } from "lucide-react";

interface GmailMessage {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
}

interface GmailInboxProps {
  onSelectEmail: (sender: string, snippet: string) => void;
  selectedId: string | null;
  onConnectionChange?: (isConnected: boolean, count: number) => void;
}

export default function GmailInbox({ onSelectEmail, selectedId, onConnectionChange }: GmailInboxProps) {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  // Pagination state
  const [pageTokens, setPageTokens] = useState<string[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMessages = useCallback(async (pageToken?: string) => {
    setIsLoading(true);
    setError("");

    try {
      const url = pageToken 
        ? `/api/gmail/messages?pageToken=${pageToken}`
        : "/api/gmail/messages";
      
      const res = await fetch(url);
      const data = await res.json();

      if (res.status === 401) {
        setIsAuthenticated(false);
        setMessages([]);
        if (onConnectionChange) onConnectionChange(false, 0);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to fetch messages.");
        return;
      }

      setIsAuthenticated(data.authenticated);
      setMessages(data.messages ?? []);
      setNextPageToken(data.nextPageToken || null);
      if (onConnectionChange) onConnectionChange(data.authenticated, (data.messages ?? []).length);
    } catch {
      setError("Network error. Could not reach Gmail.");
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, [onConnectionChange]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleRefresh = () => {
    setPageTokens([]);
    setCurrentPage(1);
    fetchMessages();
  };

  const handleNextPage = () => {
    if (nextPageToken && !isLoading) {
      setPageTokens((prev) => [...prev, nextPageToken]);
      setCurrentPage((prev) => prev + 1);
      fetchMessages(nextPageToken);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && !isLoading) {
      const newTokens = [...pageTokens];
      newTokens.pop(); // Remove current page's token
      setPageTokens(newTokens);
      setCurrentPage((prev) => prev - 1);
      
      const targetToken = newTokens.length > 0 ? newTokens[newTokens.length - 1] : undefined;
      fetchMessages(targetToken);
    }
  };

  const handleConnectGmail = () => {
    window.location.href = "/api/auth/google/login";
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/50">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            Unread Emails
            {isAuthenticated && messages.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-[10px] font-bold">
                {messages.length}
              </span>
            )}
          </h2>
        </div>
        
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Refresh inbox"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-indigo-500" : "text-slate-500"}`} />
          </Button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Content Area */}
      {!isAuthenticated && hasFetched ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-6 gap-4">
          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-5">
            <LogIn className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Connect Gmail
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
              Sign in to fetch unread emails and speed up your workflow.
            </p>
          </div>
          <Button
            onClick={handleConnectGmail}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-sm mt-2"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>
      ) : isLoading && !hasFetched ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <p className="text-xs font-medium text-slate-500">Syncing inbox...</p>
        </div>
      ) : messages.length === 0 && isAuthenticated ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-6 gap-3">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-5">
            <Inbox className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">
            Inbox Zero
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You have no unread messages.
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0 w-full">
            <div className="flex flex-col">
              {messages.map((msg) => (
                <EmailItem
                  key={msg.id}
                  id={msg.id}
                  sender={msg.sender}
                  subject={msg.subject}
                  snippet={msg.snippet}
                  isSelected={selectedId === msg.id}
                  onClick={() => onSelectEmail(msg.sender, msg.snippet)}
                />
              ))}
            </div>
          </div>
          
          {/* Pagination Controls */}
          {messages.length > 0 && (
            <div className="p-3 border-t bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto shrink-0 w-full overflow-hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
                className="h-8 px-2 sm:px-3 text-xs font-medium shrink-0"
              >
                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                Page {currentPage}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!nextPageToken || isLoading}
                className="h-8 px-2 sm:px-3 text-xs font-medium shrink-0"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 sm:ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Footer Tools */}
      {isAuthenticated && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 text-center">
           <button
             onClick={handleConnectGmail}
             className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
           >
             Switch accounts or reconnect
           </button>
        </div>
      )}
    </div>
  );
}
