"use client";

import { useEffect, useState } from "react";
import QuotaCard from "./quota-card";
import { Sparkles, Mail, Inbox } from "lucide-react";
import type { UsageStats } from "@/lib/usage-tracker";

// Provide default fallbacks so the UI doesn't crash if stats fail to load
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
  const [stats, setStats] = useState<UsageStats>(defaultStats);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Poll stats occasionally to keep dashboard fresh
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/usage-stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          setHasLoaded(true);
        }
      } catch (err) {
        console.error("Failed to fetch usage stats.", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in duration-500">
      
      {/* Gemini AI Card */}
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

      {/* Email Service Card */}
      <QuotaCard
        title="Email Service"
        icon={<Mail className="h-4 w-4 text-orange-500" />}
        statusLabel="Ready"
        statusVariant="success"
        stats={[
          { label: "Emails Sent", value: hasLoaded ? stats.emailsSent : "—" },
        ]}
      />

      {/* Gmail API Card */}
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
