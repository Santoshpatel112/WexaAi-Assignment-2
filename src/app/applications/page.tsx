"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Briefcase, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const apps = [
    { id: "1", title: "Senior Full Stack Engineer", company: "Wexa AI", status: "Interview", appliedAt: "2 days ago" },
    { id: "2", title: "Full Stack Developer", company: "Vercel", status: "Applied", appliedAt: "1 week ago" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-400" /> Job Applications for {user.name}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Active job application statuses linked to your CognoDB graph profile (`:APPLIED_TO`).
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-500/20"
        >
          Find More Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {apps.map((a) => (
          <div key={a.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-slate-100 block">{a.title}</span>
              <span className="text-xs text-slate-400">{a.company} • Applied {a.appliedAt}</span>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
