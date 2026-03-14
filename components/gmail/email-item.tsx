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
  // Extract first letter of sender for Avatar
  const initial = sender.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors border-b last:border-0 ${
        isSelected
          ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/40 dark:border-indigo-800"
          : "hover:bg-gray-50 dark:hover:bg-slate-800/60 border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900"
      }`}
    >
      {/* Avatar */}
      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
        {initial}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 w-full overflow-hidden">
        <div className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate pr-2">
          {sender}
        </div>
        <div className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate pr-2 mt-0.5">
          {subject}
        </div>
        <div className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-1 pr-2 leading-relaxed">
          {snippet}
        </div>
      </div>
    </div>
  );
}
