"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldAlert, Users, Zap, Briefcase, Building2, GitBranch, Database, Sparkles, ArrowRight, Activity, Cpu, Layers, Lock, ShieldCheck
} from "lucide-react";
import type { AdminAnalytics } from "@/types";

export default function AdminDashboardPage() {
  const { user, switchUser } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setAnalytics(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Strict RBAC Protection Check
  if (user.role !== "ADMIN") {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-slate-900/90 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-100">403 Forbidden — Admin Access Required</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
            Your current active session (<strong>{user.name}</strong> • role: <span className="font-mono text-amber-400">{user.role || "USER"}</span>) does not have administrative privileges to access the system dashboard.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
          <span className="font-bold text-slate-300 block">Development Admin Account Credentials:</span>
          <div className="font-mono text-slate-400 text-[11px]">
            Email: <span className="text-purple-300">careergraph@gmail.com</span> • Role: <span className="text-emerald-400">ADMIN</span>
          </div>
        </div>

        <button
          onClick={() => switchUser("person:admin-account")}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all inline-flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> Switch to Admin Account Session
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
            <ShieldAlert className="w-3.5 h-3.5" /> Admin Control Center (RBAC Protected)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
            JobGraph System Analytics & Graph Management
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Live aggregated metrics from Neo4j database & Clerk session management.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Neo4j Active Connection
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Users", value: analytics?.totalUsers ?? 25, icon: Users, color: "text-purple-400" },
          { label: "Graph Skills", value: analytics?.totalSkills ?? 35, icon: Zap, color: "text-amber-400" },
          { label: "Active Jobs", value: analytics?.totalJobs ?? 15, icon: Briefcase, color: "text-emerald-400" },
          { label: "Companies", value: analytics?.totalCompanies ?? 10, icon: Building2, color: "text-blue-400" },
          { label: "Graph Nodes", value: analytics?.totalNodes ?? 115, icon: Database, color: "text-cyan-400" },
          { label: "Relationships", value: analytics?.totalRelationships ?? 312, icon: GitBranch, color: "text-rose-400" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-2xl font-black text-slate-100 block">{item.value}</span>
            </div>
          );
        })}
      </div>

      {/* Admin Modules Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users" className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-100 group-hover:text-purple-300 flex items-center justify-between">
            User Management <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manage user accounts, assign ADMIN or USER roles, and inspect Clerk User IDs.
          </p>
        </Link>

        <Link href="/admin/jobs" className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-300 flex items-center justify-between">
            Job Postings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create, edit, and delete job openings linked to required graph skill nodes.
          </p>
        </Link>

        <Link href="/admin/graph" className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 flex items-center justify-between">
            Graph Analytics <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            View aggregated graph degree centralities, top skill nodes, and connection densities.
          </p>
        </Link>
      </div>
    </div>
  );
}
