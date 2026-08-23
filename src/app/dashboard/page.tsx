"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Users, Zap, Briefcase, Building2, FolderGit2, GitBranch, ArrowUpRight, Sparkles, Check, X, Bookmark, UserPlus } from "lucide-react";
import { cn, matchPercentageColor } from "@/lib/utils";
import type { GraphStats, RoleMatch } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GraphStats>({
    people: 25,
    skills: 35,
    projects: 20,
    roles: 15,
    companies: 10,
    learningResources: 20,
    relationships: 312,
  });

  const [roleMatches, setRoleMatches] = useState<RoleMatch[]>([]);

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.stats) setStats(json.data.stats);
      })
      .catch(() => {});

    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: user.id }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setRoleMatches(json.data);
      })
      .catch(() => {});
  }, [user.id]);

  const statCards = [
    { label: "People Profiles", value: stats.people, icon: Users, color: "text-purple-400 border-purple-500/30 bg-purple-500/10", href: "/people" },
    { label: "Skills in Graph", value: stats.skills, icon: Zap, color: "text-blue-400 border-blue-500/30 bg-blue-500/10", href: "/skills" },
    { label: "Active Projects", value: stats.projects, icon: FolderGit2, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", href: "/skills" },
    { label: "Career Roles", value: stats.roles, icon: Briefcase, color: "text-amber-400 border-amber-500/30 bg-amber-500/10", href: "/roles" },
    { label: "Partner Companies", value: stats.companies, icon: Building2, color: "text-rose-400 border-rose-500/30 bg-rose-500/10", href: "/companies" },
    { label: "Graph Connections", value: stats.relationships, icon: GitBranch, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", href: "/graph" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      {/* Personalized Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Personalized Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-1">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            Role: <strong className="text-purple-400">{user.title}</strong> • Active Session: <code className="text-xs text-slate-300">{user.id}</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-xs transition-all"
          >
            <UserPlus className="w-4 h-4 text-purple-400" /> Complete Onboarding
          </Link>
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Open Personalized Graph
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-xl border flex items-center justify-center", card.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
              <div className="text-2xl font-extrabold text-slate-100 group-hover:scale-105 transition-transform origin-left">
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-0.5">{card.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Role Match & Skill Coverage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Role Match List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" /> Role Matches for {user.name}
              </h2>
              <p className="text-xs text-slate-400">Match percentages calculated dynamically from your stored graph skills</p>
            </div>
            <Link href="/career-path" className="text-xs text-purple-400 hover:underline font-semibold">
              View Path →
            </Link>
          </div>

          <div className="space-y-3">
            {roleMatches.length > 0 ? (
              roleMatches.map((match) => (
                <div
                  key={match.role.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{match.role.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {match.role.salaryRange}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Matched: {match.matchedSkills.slice(0, 3).map((s) => s.name).join(", ")}
                      </span>
                      {match.missingSkills.length > 0 && (
                        <span className="text-rose-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Missing: {match.missingSkills.slice(0, 2).map((s) => s.name).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <span className={cn("text-lg font-extrabold block", matchPercentageColor(match.matchPercentage))}>
                        {match.matchPercentage}% Match
                      </span>
                      <span className="text-[10px] text-slate-500">Calculated Score</span>
                    </div>
                    <Link
                      href={`/career-path?role=${match.role.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                    >
                      Inspect Path
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">Calculating role matches...</div>
            )}
          </div>
        </div>

        {/* User Graph Status */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-blue-400" /> Active User Topology
          </h2>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Authenticated Identity</span>
              <span className="font-bold text-slate-200">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Role</span>
              <span className="text-purple-400 font-semibold">{user.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className="text-emerald-400 font-mono">Graph Connected</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300/90 space-y-2">
            <div className="font-bold text-purple-200">💡 Switch Demo User</div>
            <p>Use the dropdown in the top navigation bar to instantly switch between <strong>User A (Santosh - Full Stack)</strong>, <strong>User B (Sarah - ML)</strong>, or <strong>Create a New Profile</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
