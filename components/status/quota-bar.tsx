"use client";

import { useEffect } from "react";
import QuotaCard from "./quota-card";
import { Sparkles, Mail, Inbox } from "lucide-react";
import type { UsageStats } from "@/lib/usage-tracker";
import { useAppFetch } from "@/hooks/useAppFetch";

const defaultStats: UsageStats = {
  aiRequests: 0,
  promptTokens: 0,
  responseTokens: 0,
  totalTokens: 0,
  emailsSent: 0,
  lastReset: "",
};

interface QuotaBarProps {
  isGmailConnected: boolean;
  unreadCount: number;
}

export default function QuotaBar({ isGmailConnected, unreadCount }: QuotaBarProps) {
  const { data: fetchStats, execute } = useAppFetch<UsageStats>("/api/usage-stats");
  const stats = fetchStats || defaultStats;
  const hasLoaded = !!fetchStats;

  useEffect(() => {
    const interval = setInterval(() => execute(), 30000); 
    return () => clearInterval(interval);
  }, [execute]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in duration-500">
      
      <QuotaCard
        title="Gemini AI"
        icon={<Sparkles className="h-4 w-4 text-purple-500" />}
        statusLabel="Active"
        statusVariant="success"
        stats={[
          { label: "Requests Today", value: hasLoaded ? stats.aiRequests : "—" },
          { label: "Prompt Tokens Used", value: hasLoaded ? stats.promptTokens.toLocaleString() : "—" },
          { label: "Response Tokens Used", value: hasLoaded ? stats.responseTokens.toLocaleString() : "—" },
          { label: "Total Tokens", value: hasLoaded ? stats.totalTokens.toLocaleString() : "—" },
        ]}
      />

      <QuotaCard
        title="Email Service"
        icon={<Mail className="h-4 w-4 text-orange-500" />}
        statusLabel="Ready"
        statusVariant="success"
        stats={[
          { label: "Emails Sent", value: hasLoaded ? stats.emailsSent : "—" },
        ]}
      />

      <QuotaCard
        title="Gmail API"
        icon={<Inbox className="h-4 w-4 text-red-500" />}
        statusLabel={isGmailConnected ? "Connected" : "Disconnected"}
        statusVariant={isGmailConnected ? "success" : "default"}
        stats={[
          { label: "Sync Status", value: isGmailConnected ? "Active" : "Offline" },
          { label: "Unread Emails", value: isGmailConnected ? unreadCount : 0 },
        ]}
      />

    </div>
  );
}
