import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IntentDisplay({ intent }: { intent: string }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          Detected Intent
        </label>
        <Badge variant="outline" className="text-[10px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium">
          AI Analysis
        </Badge>
      </div>
      <div className="rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/60 dark:border-purple-900/40 p-3.5 shadow-sm">
        <p className="text-sm font-medium text-purple-900 dark:text-purple-200 leading-relaxed">
          {intent}
        </p>
      </div>
    </div>
  );
}
