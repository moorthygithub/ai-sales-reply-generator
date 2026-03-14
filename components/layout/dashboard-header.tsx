import { type ReactNode } from "react";
import { Bot, Sparkles, LayoutDashboard, FileText } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader({ rightContent }: { rightContent?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600 p-2">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
              AI Sales Reply
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide flex items-center gap-1 mt-1">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              SaaS Dashboard
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Inbox
          </Link>
          <Link href="/docs" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
            <FileText className="h-4 w-4" />
            Docs
          </Link>
        </nav>

        {/* Right Content (Logout usually lives here) */}
        {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
      </div>
    </header>
  );
}
