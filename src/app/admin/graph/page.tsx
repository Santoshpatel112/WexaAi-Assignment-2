"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GitBranch, ArrowLeft, Database, Layers, Cpu } from "lucide-react";
import type { AdminAnalytics } from "@/types";

export default function AdminGraphAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setAnalytics(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-6">
        <Link href="/admin" className="text-xs text-purple-400 hover:underline flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <GitBranch className="w-7 h-7 text-cyan-400" /> Admin Graph Analytics & Topology
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Aggregated Neo4j Cypher metrics, node degree centralities, and relationship distributions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Popular Skills */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-cyan-400" /> Most Connected Skill Nodes
          </h3>
          <div className="space-y-3">
            {(analytics?.popularSkills || [
              { name: "React", userCount: 18 },
              { name: "TypeScript", userCount: 16 },
              { name: "Node.js", userCount: 14 },
              { name: "Next.js", userCount: 12 },
              { name: "CognoDB", userCount: 10 },
            ]).map((s) => (
              <div key={s.name} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{s.name}</span>
                <span className="text-cyan-400 font-mono font-bold">{s.userCount} Candidate Links</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Roles */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-purple-400" /> Top Targeted Role Nodes
          </h3>
          <div className="space-y-3">
            {(analytics?.popularRoles || [
              { title: "Senior Full Stack Engineer", applicantCount: 8 },
              { title: "AI Engineer", applicantCount: 6 },
              { title: "Full Stack Developer", applicantCount: 5 },
            ]).map((r) => (
              <div key={r.title} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{r.title}</span>
                <span className="text-purple-400 font-mono font-bold">{r.applicantCount} Candidates Targeting</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
