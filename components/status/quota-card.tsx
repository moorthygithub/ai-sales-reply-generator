import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ReactNode } from "react";

interface QuotaCardProps {
  title: string;
  icon: ReactNode;
  stats: { label: string; value: string | number; highlight?: boolean }[];
  statusLabel: string;
  statusVariant: "success" | "warning" | "destructive" | "default";
}

export default function QuotaCard({
  title,
  icon,
  stats,
  statusLabel,
  statusVariant,
}: QuotaCardProps) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/50">
      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
            {icon}
            <h3 className="text-sm">{title}</h3>
          </div>
          <Badge variant={statusVariant} className="text-[10px] uppercase tracking-wider px-2 py-0.5">
            {statusLabel}
          </Badge>
        </div>

        <div className="space-y-2.5 mt-auto">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">{stat.label}</span>
              <span className={`font-medium ${stat.highlight ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-700 dark:text-slate-300"}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
