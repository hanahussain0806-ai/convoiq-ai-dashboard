"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Brain, LayoutDashboard, Upload, History, Settings, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: Upload,          label: "New Analysis", href: "/upload" },
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard" },
  { icon: History,         label: "History",      href: "/history" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        "hidden md:flex flex-col sticky top-0 h-screen border-r border-slate-800/60 bg-[#080D1A] transition-all duration-300 z-40 shrink-0",
        expanded ? "w-52" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        {expanded && (
          <span className="font-bold text-white text-sm whitespace-nowrap overflow-hidden">ConvoIQ</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={cn(
                "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {expanded && <span className="whitespace-nowrap">{label}</span>}
              {expanded && active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-2 space-y-1 border-t border-slate-800/60">
        <button className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all">
          <Settings className="w-4 h-4 shrink-0" />
          {expanded && <span>Settings</span>}
        </button>
        <button
          onClick={() => { localStorage.removeItem("convoiq_auth"); router.push("/login"); }}
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {expanded && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
