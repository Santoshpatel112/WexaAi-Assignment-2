"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Network, Sparkles, ArrowRight, Zap, Target, GitBranch, Bot, CheckCircle2, ShieldCheck, Database, Building2, User
} from "lucide-react";
import { InteractiveGraphBackground } from "@/components/ui/InteractiveGraphBackground";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      {/* INTERACTIVE MOUSE CURSOR GRAPH BACKGROUND CANVAS */}
      <InteractiveGraphBackground />

      {/* Radial Background Beams Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-teal-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute inset-0 bg-graph-grid opacity-20 pointer-events-none z-0" />

      {/* Top Header Landing Bar */}
      <header className="h-20 border-b border-slate-800/80 px-6 md:px-12 flex items-center justify-between z-20 backdrop-blur-xl bg-slate-950/60 relative">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Network className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <span className="font-black text-lg text-slate-100">CareerGraph</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION WITH MOTION ANIMATIONS & MOUSE GRAPH BACKDROP */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 max-w-7xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-8 shadow-lg shadow-teal-500/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>WEXA AI CognoDB Graph Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6"
        >
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Turn Your Skills Into
          </span>{" "}
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Opportunities.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Discover the jobs, companies and career paths that match your skills through an intelligent career graph. Move your cursor to interact with node relationships.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <Link
            href="/graph"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group"
          >
            <Network className="w-4 h-4" />
            Explore My JobGraph
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            How It Works
          </a>
        </motion.div>

        {/* Demo Credentials Preview Badge on Home Page */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-md text-xs mb-16 shadow-xl"
        >
          <span className="font-bold text-teal-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Demo Credentials:
          </span>
          <span className="font-mono text-slate-300">
            Email: <code className="text-slate-100 font-bold">santoshpatelvns5@gmail.com</code> • Password: <code className="text-teal-300 font-bold">santosh123456789#</code>
          </span>
        </motion.div>

        {/* HERO GRAPH ANIMATION CANVAS CARD WITH FLOATING MOTION NODES */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-4xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-8 backdrop-blur-2xl shadow-2xl overflow-hidden group"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8 text-xs text-slate-400">
            <span className="font-mono text-teal-400 font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" /> CognoDB openCypher Live Topology
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-mono font-bold">
              92% Target Role Match
            </span>
          </div>

          {/* Animated Hero Nodes Flow with Motion */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center text-center py-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 shadow-lg"
            >
              <span className="text-[10px] uppercase font-extrabold text-purple-400 block mb-1">Candidate</span>
              <span className="font-bold text-sm text-slate-100">Candidate Node</span>
            </motion.div>

            <div className="text-purple-400 font-mono text-xs flex justify-center items-center">
              → HAS_SKILL →
            </div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 shadow-lg"
            >
              <span className="text-[10px] uppercase font-extrabold text-teal-400 block mb-1">Skill Nodes</span>
              <span className="font-bold text-sm text-slate-100">React • Node.js</span>
            </motion.div>

            <div className="text-amber-400 font-mono text-xs flex justify-center items-center">
              ← REQUIRES ←
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-lg"
            >
              <span className="text-[10px] uppercase font-extrabold text-amber-400 block mb-1">Matched Role</span>
              <span className="font-bold text-sm text-slate-100">Full Stack Engineer</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* WHY JOBGRAPH SECTION */}
      <section className="py-20 bg-slate-900/60 border-t border-slate-800/80 px-4 relative z-10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-100">Why JobGraph?</h2>
            <p className="text-slate-400 text-sm">
              Traditional job portals use keyword matching. JobGraph maps your skills as interconnected graph nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "1. Your Skills → Opportunities", icon: Zap, color: "text-teal-400 bg-teal-500/10", desc: "See which jobs actually match the skills you already have in real-time." },
              { title: "2. Understand Skill Gaps", icon: Target, color: "text-rose-400 bg-rose-500/10", desc: "Discover exactly what skills you are missing for your target career roles." },
              { title: "3. Explore Connections", icon: GitBranch, color: "text-cyan-400 bg-cyan-500/10", desc: "Visualize relationships between your skills, projects, roles, and hiring companies." },
              { title: "4. Grok AI Assistant", icon: Bot, color: "text-emerald-400 bg-emerald-500/10", desc: "Ask questions about your career and get answers based on your actual graph profile." },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-100">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-4 max-w-6xl mx-auto space-y-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-100">How JobGraph Works</h2>
          <p className="text-slate-400 text-sm">4 simple steps to build your career knowledge topology</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Create Profile", desc: "Set up your basic candidate identity." },
            { step: "02", title: "Build Skill Graph", desc: "Add skills, proficiencies, and projects." },
            { step: "03", title: "Discover Jobs", desc: "Calculated match scores via graph traversal." },
            { step: "04", title: "Close Skill Gaps", desc: "Get sequential learning resource paths." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 relative backdrop-blur-md"
            >
              <span className="text-3xl font-black text-teal-400 font-mono block">{item.step}</span>
              <h3 className="font-bold text-base text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
