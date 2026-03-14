import { type ReactNode } from "react";

interface EmailItemProps {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function EmailItem({
  sender,
  subject,
  snippet,
  isSelected,
  onClick,
}: EmailItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 group relative overflow-hidden ${
        isSelected
          ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 dark:border-indigo-500/40 shadow-sm"
          : "border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-indigo-300/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-sm"
      }`}
    >
      {/* Selected Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
          {sender.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Sender */}
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {sender}
            </p>
            {isSelected && (
              <span className="flex-shrink-0 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </div>
          {/* Subject */}
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mb-1">
            {subject}
          </p>
          {/* Snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {snippet}
          </p>
        </div>
      </div>
    </button>
  );
}
