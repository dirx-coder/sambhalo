"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search, Star, Sparkles, BarChart2,
  FolderDot, Key, Hash, ChevronRight,
  HelpCircle, Settings, X, Zap
} from "lucide-react";

export default function Sidebar() {
  const [premiumVisible, setPremiumVisible] = useState(true);

  return (
    <aside className="w-65 h-screen shrink-0 bg-[#18181b] border-r border-[#27272a] flex flex-col md:flex text-[#a1a1aa] overflow-y-auto overflow-x-hidden kanban-scroll">

      {/* Brand & Main Nav */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[#fafafa] font-bold text-lg tracking-tight">Sambhalo</span>
      </div>

      {/* Global Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#111113] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 px-3 space-y-6 pb-20">

        {/* Favorites */}
        <div className="space-y-1">
          <div className="px-2 pb-1 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#52525b] uppercase">
            <ChevronRight className="w-3 h-3 rotate-90" />
            Favorites
          </div>
          <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors">
            <Star className="w-4 h-4 text-[#ef4444]" /> AI Writer
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors">
            <Star className="w-4 h-4 text-[#3b82f6]" /> Data Insights
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors">
            <Star className="w-4 h-4 text-[#eab308]" /> Predictive AI
          </button>
        </div>

        {/* All Projects */}
        <div className="space-y-1">
          <div className="px-2 pb-1 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#52525b] uppercase">
            <ChevronRight className="w-3 h-3 rotate-90" />
            All Projects
          </div>
          <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors group">
            <div className="flex items-center gap-2.5">
              <FolderDot className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors" /> Sales Forecast
            </div>
            <span className="text-[10px] text-[#52525b]">2</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors group">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors" /> Sentiment AI
            </div>
            <span className="text-[10px] text-[#52525b]">7</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm bg-[#6366f1]/10 text-[#fafafa] font-medium transition-colors">
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-4 h-4 text-[#6366f1]" /> Task Automate
            </div>
            <span className="text-[10px] text-[#6366f1]">18</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors group">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-[#eab308]" /> Script AI
            </div>
            <span className="text-[10px] text-[#52525b]">3</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors group">
            <div className="flex items-center gap-2.5">
              <FolderDot className="w-4 h-4 text-[#ef4444]" /> Lead Scoring
            </div>
            <span className="text-[10px] text-[#52525b]">15</span>
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <div className="px-2 pb-1 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#52525b] uppercase">
            <ChevronRight className="w-3 h-3 rotate-90" />
            Categories
          </div>
          <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors">
            <Hash className="w-4 h-4 text-[#ec4899]" /> Marketing AI
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors">
            <Hash className="w-4 h-4 text-[#06b6d4]" /> Chatbots
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors">
            <Hash className="w-4 h-4 text-[#a855f7]" /> Finance AI
          </button>
        </div>
      </div>

      {/* Bottom Sticky Section */}
      <div className="sticky bottom-0 bg-[#18181b] p-4 border-t border-[#27272a]">

        {premiumVisible && (
          <div className="relative bg-linear-to-b from-[#27272a] to-[#111113] rounded-xl p-4 border border-[#3f3f46] mb-4 shadow-lg shadow-black/50">
            <button
              onClick={() => setPremiumVisible(false)}
              className="absolute top-2 right-2 text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="text-[#fafafa] text-sm font-bold mb-1 leading-tight pr-4">Unlock Premium<br />Features</h4>
            <p className="text-[#a1a1aa] text-[11px] mb-3 leading-relaxed">Advanced AI, automation, and insights.</p>
            <button className="w-full py-2 rounded-lg bg-linear-to-r from-[#818cf8] to-[#6366f1] text-white text-xs font-bold hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
              Upgrade to premium
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-[#a1a1aa]">
          <button className="p-2 rounded-lg hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors cursor-pointer">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#27272a]/50 hover:text-[#fafafa] transition-colors cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

    </aside>
  );
}