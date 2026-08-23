"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Briefcase, ArrowLeft, Building2, Zap, GitBranch } from "lucide-react";
import type { RoleDetail } from "@/types";

export default function RoleDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const roleId = rawId?.startsWith("role:") ? rawId : `role:${rawId}`;

  const [role, setRole] = useState<RoleDetail | null>(null);

  useEffect(() => {
    if (!roleId) return;
    fetch(`/api/roles/${roleId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setRole(res.data);
        else setRole(getFallbackRole(roleId));
      })
      .catch(() => setRole(getFallbackRole(roleId)));
  }, [roleId]);

  const r = role || getFallbackRole("role:fullstack-engineer");

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <Link href="/roles" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Roles
      </Link>

      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-100">{r.title}</h1>
              <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {r.salaryRange}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{r.description}</p>
          </div>
        </div>

        <Link
          href={`/career-path?role=${r.id}`}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <GitBranch className="w-4 h-4" /> Match Candidate Skills
        </Link>
      </div>

      {/* Required Skills & Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-5 h-5 text-blue-400" /> Required Skills (:REQUIRES_SKILL)
          </h2>
          <div className="space-y-3">
            {r.requiredSkills.map((rs) => (
              <div key={rs.skill.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-100 block">{rs.skill.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">Min level: {rs.minimumLevel}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {rs.importance}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-rose-400" /> Hiring Companies (:OFFERED_BY)
          </h2>
          <div className="space-y-3">
            {r.companies.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-100 block">{c.name}</span>
                  <span className="text-xs text-slate-400">{c.industry} • {c.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getFallbackRole(id: string): RoleDetail {
  return {
    id: "role:fullstack-engineer",
    title: "Full Stack Engineer",
    description: "Own features end-to-end across frontend and backend services.",
    level: "Mid",
    salaryRange: "$130K-$175K",
    requiredSkills: [
      { skill: { id: "skill:react", name: "React", category: "Frontend", difficulty: "Intermediate", description: "" }, importance: "critical", minimumLevel: "intermediate" },
      { skill: { id: "skill:nodejs", name: "Node.js", category: "Backend", difficulty: "Intermediate", description: "" }, importance: "critical", minimumLevel: "intermediate" },
      { skill: { id: "skill:typescript", name: "TypeScript", category: "Frontend", difficulty: "Intermediate", description: "" }, importance: "high", minimumLevel: "intermediate" },
      { skill: { id: "skill:docker", name: "Docker", category: "DevOps", difficulty: "Intermediate", description: "" }, importance: "medium", minimumLevel: "beginner" },
    ],
    companies: [
      { id: "company:vercel", name: "Vercel", industry: "Developer Tools", location: "Remote / San Francisco", website: "https://vercel.com" },
      { id: "company:linear", name: "Linear", industry: "Developer Tools", location: "Remote", website: "https://linear.app" },
    ]
  };
}
