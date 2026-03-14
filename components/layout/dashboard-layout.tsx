import { type ReactNode } from "react";
import DashboardHeader from "./dashboard-header";

export default function DashboardLayout({ children, headerRight }: { children: ReactNode, headerRight?: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans flex flex-col">
      <DashboardHeader rightContent={headerRight} />
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {children}
      </main>
      <footer className="py-4 border-t bg-white dark:bg-slate-900 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 text-center">
          <p className="text-xs text-slate-500">
            Powered by Next.js &middot; Gemini AI &middot; Gmail API
          </p>
        </div>
      </footer>
    </div>
  );
}
