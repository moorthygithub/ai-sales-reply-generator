import { Mail } from "lucide-react";

export default function SubjectDisplay({ subject }: { subject: string }) {
  return (
    <div className="space-y-2.5">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Mail className="h-3.5 w-3.5 text-blue-500" />
        Subject Line
      </label>
      <div className="rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/40 p-3.5 shadow-sm">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 truncate">
          {subject}
        </p>
      </div>
    </div>
  );
}
