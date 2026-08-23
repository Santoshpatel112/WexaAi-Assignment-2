"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignUp } from "@clerk/nextjs";
import { Network, Sparkles, CheckCircle2, Zap, User } from "lucide-react";
import { InteractiveGraphBackground } from "@/components/ui/InteractiveGraphBackground";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex overflow-hidden relative">
      {/* INTERACTIVE MOUSE CURSOR GRAPH BACKGROUND CANVAS */}
      <InteractiveGraphBackground />

      {/* Left Column: Interactive Graph Cloud Info */}
      <div className="hidden lg:flex flex-1 relative p-12 items-center justify-center border-r border-slate-800/80 z-10 pointer-events-none">
        <div className="max-w-lg space-y-6 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg shadow-teal-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> CognoDB Cloud Graph Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-100 leading-tight"
          >
            The managed graph database,{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              built for scale.
            </span>
          </motion.h1>

          <div className="space-y-3 pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>Provision managed graph databases in seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>Pause, resume and scale from a single console</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>Connect with any Bolt driver — Python, JS, Go, Java</span>
            </div>
          </div>

          {/* New Candidate Graph Node Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-4 relative overflow-hidden mt-6"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-200">New Candidate Graph Node</span>
              </div>
              <span className="font-extrabold text-teal-400 text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                Ready for Graph
              </span>
            </div>

            <div className="flex gap-2 text-[10px] font-mono text-teal-300">
              <span className="bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-teal-400" /> HAS_SKILL → TypeScript
              </span>
              <span className="bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> WORKED_ON → Next.js
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Clerk Sign Up Component */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center space-y-4"
        >
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
              <Network className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-100">CareerGraph</span>
          </Link>

          <SignUp
            routing="hash"
            fallbackRedirectUrl="/onboarding"
            signInUrl="/login"
          />
        </motion.div>
      </div>
    </div>
  );
}
