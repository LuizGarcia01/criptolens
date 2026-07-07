"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Início",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="10" width="7" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity="0.2" />
        <rect x="13" y="6" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity="0.2" />
        <path d="M2 7h7M2 7V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/aprender",
    label: "Aprender",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3L2 7.5l9 4.5 9-4.5L11 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={active ? "currentColor" : "none"} fillOpacity="0.2" />
        <path d="M5 9.5v4c0 2 2.5 3.5 6 3.5s6-1.5 6-3.5v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 7.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/simular",
    label: "Simular",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity="0.15" />
        <path d="M8.5 7.5l5 3.5-5 3.5V7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={active ? "currentColor" : "none"} fillOpacity="0.5" />
      </svg>
    ),
  },
  {
    href: "/sinais",
    label: "Sinais",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 15l4.5-5 3.5 3 4-6 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="19" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity="0.3" />
        <path d="M3 18h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Instrutor",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2.5C6.3 2.5 2.5 5.96 2.5 10.25c0 2.05.85 3.91 2.24 5.28L3.5 19l3.6-1.56C8.28 17.8 9.62 18 11 18c4.7 0 8.5-3.46 8.5-7.75S15.7 2.5 11 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={active ? "currentColor" : "none"} fillOpacity="0.2" />
        <circle cx="8" cy="10.25" r="1" fill="currentColor" />
        <circle cx="11" cy="10.25" r="1" fill="currentColor" />
        <circle cx="14" cy="10.25" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-cl-border bg-cl-surface"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors"
              style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
            >
              {item.icon(active)}
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
