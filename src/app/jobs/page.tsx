"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Briefcase, Search, Check, X, Bookmark, ExternalLink } from "lucide-react";
import { cn, matchPercentageColor } from "@/lib/utils";
import type { RoleMatch } from "@/types";

export default function JobsPage() {
  const { user } = useAuth();
  const [roleMatches, setRoleMatches] = useState<RoleMatch[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: user.id }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setRoleMatches(res.data);
      })
      .catch(() => {});
  }, [user.id]);

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-purple-400" /> Graph-Matched Job Opportunities
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Personalized job recommendations calculated dynamically from your stored graph skills.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter jobs..."
            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500 w-full sm:w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {roleMatches.map((match) => (
          <div
            key={match.role.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-base text-slate-100">{match.role.title}</h3>
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {match.role.salaryRange}
                </span>
              </div>
              <p className="text-xs text-slate-400">{match.role.description}</p>

              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                {match.matchedSkills.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    <Check className="w-3 h-3" /> {s.name}
                  </span>
                ))}
                {match.missingSkills.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    <X className="w-3 h-3" /> {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <span className={cn("text-xl font-extrabold block", matchPercentageColor(match.matchPercentage))}>
                  {match.matchPercentage}% Match
                </span>
                <span className="text-[10px] text-slate-500">Graph Match</span>
              </div>

              <button
                onClick={() => toggleSave(match.role.id)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all",
                  savedJobs.has(match.role.id)
                    ? "bg-purple-600/20 border-purple-500 text-purple-400"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                )}
                title="Save Job"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <Link
                href={`/career-path?role=${match.role.id}`}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition-all"
              >
                View Career Path
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
