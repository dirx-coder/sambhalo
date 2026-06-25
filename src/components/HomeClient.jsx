"use client";

import Link from "next/link";
import { ArrowRight, Columns3, GripVertical, Shield, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeClient() {
  return (
    <main className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-4 overflow-hidden bg-[#09090b]">
      {/* Abstract Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.15]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="dotted-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-white/20" />
            </pattern>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-grid)" />

          <motion.path
            d="M -100,200 C 300,300 400,100 800,400"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="hidden lg:block absolute left-0"
          />
          <motion.path
            d="M 100vw,700 C calc(100vw - 400px),500 calc(100vw - 600px),900 calc(100vw - 900px),600"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
            className="hidden lg:block absolute right-0"
          />
        </svg>
      </div>

      {/* Floating Abstract Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-32 h-24 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl backdrop-blur-md"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[25%] right-[15%] w-40 h-16 bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl backdrop-blur-md"
        />
      </div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl text-center space-y-10"
      >
        {/* Animated Brand Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 150 }}
          className="relative inline-flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[#0070f3]/30 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 flex items-center justify-center rounded-3xl bg-[#111113]/80 backdrop-blur-xl border border-[#27272a] shadow-inner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M2 17L12 22L22 17"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M2 12L12 17L22 12"
                stroke="#4338ca"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.25, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Hero Typography */}
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm"
          >
            Sambhalo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-[#a1a1aa] leading-relaxed max-w-lg mx-auto font-medium"
          >
            A lightweight, incredibly fast, and secure Kanban board.
            Organize your workflow with pure simplicity.
          </motion.p>
        </div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Columns3, text: "Kanban Boards" },
            { icon: GripVertical, text: "Drag & Drop" },
            { icon: Shield, text: "Private & Secure" },
            { icon: Layers, text: "Beautiful UI" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(24,24,27,1)" }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#111113]/80 backdrop-blur-md border border-[#27272a] text-sm text-[#a1a1aa] transition-colors cursor-default"
            >
              <feature.icon className="w-4 h-4 text-[#0070f3]" />
              {feature.text}
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6, type: "spring", stiffness: 150 }}
          className="pt-4"
        >
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0070f3] text-white text-base font-semibold hover:bg-[#0070f3]/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,112,243,0.4)] hover:shadow-[0_0_30px_rgba(0,112,243,0.6)]"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-2xl ring-2 ring-[#0070f3] ring-offset-2 ring-offset-[#09090b] opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}