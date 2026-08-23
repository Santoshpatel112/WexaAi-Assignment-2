"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Bookmark, Briefcase, ArrowRight, Trash2 } from "lucide-react";

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([
    { id: "job:senior-fullstack", title: "Senior Full Stack Engineer", company: "Wexa AI", location: "Remote", matchPercentage: 92 },
    { id: "job:ai-eng", title: "AI Engineer", company: "Wexa AI", location: "San Francisco, CA", matchPercentage: 75 },
  ]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-purple-400" /> Saved Jobs for {user.name}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Jobs saved to your personalized CognoDB graph (`:SAVED` relationship).
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-500/20"
        >
          Explore All Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {savedJobs.map((j) => (
          <div key={j.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-slate-100 block">{j.title}</span>
              <span className="text-xs text-slate-400">{j.company} • {j.location}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-emerald-400 font-mono">{j.matchPercentage}% Match</span>
              <button
                onClick={() => setSavedJobs((prev) => prev.filter((item) => item.id !== j.id))}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                title="Unsave Job"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
