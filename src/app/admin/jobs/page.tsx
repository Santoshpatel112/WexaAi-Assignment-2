"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, ArrowLeft, Trash2, Edit } from "lucide-react";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([
    { id: "job:fullstack-eng", title: "Full Stack Engineer", company: "Wexa AI", location: "Remote", skills: ["React", "Node.js", "TypeScript"] },
    { id: "job:senior-fullstack", title: "Senior Full Stack Engineer", company: "Wexa AI", location: "Remote", skills: ["React", "Next.js", "TypeScript", "Docker"] },
    { id: "job:ai-eng", title: "AI Engineer", company: "Wexa AI", location: "San Francisco, CA", skills: ["Python", "PyTorch", "Grok", "Neo4j"] },
  ]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <Link href="/admin" className="text-xs text-purple-400 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-emerald-400" /> Admin Job Postings
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Create, edit, and delete job openings linked to required skill nodes in Neo4j.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Create New Job Node
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((j) => (
          <div key={j.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-slate-100 block">{j.title}</span>
              <span className="text-xs text-slate-400">{j.company} • {j.location}</span>
              <div className="flex gap-1.5 flex-wrap mt-2">
                {j.skills.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
