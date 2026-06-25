"use client";

import { signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import {
  LogOut, Sun, Moon,
  Search, LayoutGrid, Table2, Filter,
  Star, Plus, Bell, MoreVertical, LayoutList, CheckSquare
} from "lucide-react";
import { motion } from "framer-motion";

export default function BoardHeader({ user }) {
  const [theme, setTheme] = useState("dark");
  const [activeView, setActiveView] = useState("board");

  // ── Sync theme on mount ──
  useEffect(() => {
    const stored = localStorage.getItem("sambhalo-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current || "dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 400);
    localStorage.setItem("sambhalo-theme", next);
  }, [theme]);

  return (
    <header className="sticky top-0 z-30 bg-[#1c1c1f] border-b border-[#27272a] flex flex-col pt-4">

      {/* ── Row 1: Title & Actions ── */}
      <div className="flex items-center justify-between px-6 pb-4">

        {/* Title area */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shadow-inner">
            <div className="w-4 h-4 bg-linear-to-tr from-[#6366f1] to-[#a855f7] rounded-sm rotate-12" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Task Automate</h1>
          <button className="text-[#52525b] hover:text-[#eab308] transition-colors">
            <Star className="w-4 h-4" />
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">

          <button className="w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center text-white hover:bg-[#818cf8] transition-colors shadow-[0_0_10px_rgba(99,102,241,0.4)]">
            <Plus className="w-4 h-4" />
          </button>

          {/* Avatar Cluster */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#18181b] flex items-center justify-center ring-2 ring-[#1c1c1f] text-white text-[10px] font-bold z-30">AB</div>
              <div className="w-7 h-7 rounded-full bg-[#27272a] flex items-center justify-center ring-2 ring-[#1c1c1f] text-white text-[10px] font-bold z-20">CD</div>
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-7 h-7 rounded-full ring-2 ring-[#1c1c1f] z-10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center ring-2 ring-[#1c1c1f] text-white text-[10px] font-bold z-10">
                  {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#a1a1aa]">
            <button className="hover:text-white transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="hover:text-white transition-colors"><Search className="w-4 h-4" /></button>
            <button className="hover:text-white transition-colors" onClick={() => signOut({ callbackUrl: "/" })} title="Sign out"><LogOut className="w-4 h-4" /></button>
            <button className="hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Row 2: View tabs & Filter ── */}
      <div className="flex items-center justify-between px-6 border-t border-[#27272a]/50 pt-2">

        {/* View toggle tabs */}
        <div className="flex items-center gap-1">
          {[
            { id: "board", icon: LayoutGrid, label: "Kanban" },
            { id: "table", icon: Table2, label: "Table" },
            { id: "list", icon: LayoutList, label: "List" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium cursor-pointer group"
            >
              <Icon className={`w-4 h-4 transition-colors ${activeView === id ? "text-[#818cf8]" : "text-[#52525b] group-hover:text-[#a1a1aa]"}`} />
              <span className={`transition-colors ${activeView === id ? "text-white" : "text-[#a1a1aa] group-hover:text-white"}`}>
                {label}
              </span>
              {activeView === id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#818cf8] rounded-t-full shadow-[0_-2px_10px_rgba(129,140,248,0.5)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Filter & sort */}
        <div className="flex items-center py-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                       text-[#a1a1aa] hover:text-white hover:bg-[#27272a]
                       transition-all duration-150 cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
    </header>
  );
}