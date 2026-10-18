"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearTokens } from "@/lib/api";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/send", label: "Send money", icon: "send" },
  { href: "/receive", label: "Receive", icon: "receive" },
  { href: "/requests", label: "Requests", icon: "requests" },
  { href: "/history", label: "History", icon: "history" },
  { href: "/merchant", label: "Merchant", icon: "merchant" },
];

function Icon({ name }: { name: string }) {
  const common = "h-5 w-5 shrink-0";
  switch (name) {
    case "dashboard":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "send":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22l-4-9-9-4 20-7z" />
        </svg>
      );
    case "receive":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case "requests":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 2h6v4H9z" />
          <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="15" y2="16" />
        </svg>
      );
    case "history":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case "merchant":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l1.5-5h15L21 9" />
          <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="md:sticky md:top-20 md:self-start">
      <div className="rounded-2xl border border-border bg-white p-3 shadow-sm">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>
        <nav className="space-y-1">
          {ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-charcoal-800 text-white shadow-sm"
                    : "text-charcoal-700 hover:bg-surface-2 hover:text-charcoal-900"
                )}
              >
                <Icon name={item.icon} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => { clearTokens(); window.location.href = "/"; }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-charcoal-700 hover:bg-surface-2 hover:text-charcoal-900"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span className="truncate">Logout</span>
          </button>
        </nav>

        <div className="mt-4 rounded-xl bg-surface-2 p-3">
          <p className="text-xs font-semibold text-charcoal-700">Test environment</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Balances are simulated, not real money.
          </p>
        </div>
      </div>
    </aside>
  );
}
