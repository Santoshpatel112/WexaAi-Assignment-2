"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { User, MapPin, Briefcase, Zap, FolderGit2, GitBranch, ArrowLeft, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonDetail } from "@/types";

export default function PersonDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const personId = rawId?.startsWith("person:") ? rawId : `person:${rawId}`;

  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) return;
    fetch(`/api/people/${personId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setPerson(res.data);
        } else {
          setPerson(getFallbackPerson(personId));
        }
      })
      .catch(() => setPerson(getFallbackPerson(personId)))
      .finally(() => setLoading(false));
  }, [personId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading person graph profile...</div>;
  }

  const p = person || getFallbackPerson("person:santosh-patel");

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <Link href="/people" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to People
      </Link>

      {/* Header Profile Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl ring-4 ring-purple-500/20">
            {p.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-100">{p.name}</h1>
              <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            </div>
            <p className="text-sm font-semibold text-purple-400 mt-0.5">{p.title}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {p.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-500" /> {p.experienceYears} Years Experience</span>
            </div>
          </div>
        </div>

        <Link
          href={`/career-path?person=${p.id}`}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <GitBranch className="w-4 h-4" /> Calculate Career Path
        </Link>
      </div>

      {/* Grid Skills & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-5 h-5 text-blue-400" /> Skills & Proficiency (:HAS_SKILL)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {p.skills.map((s) => (
              <div key={s.skill.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-200 block">{s.skill.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{s.level} • {s.years} yrs</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <FolderGit2 className="w-5 h-5 text-emerald-400" /> Projects (:WORKED_ON)
          </h2>
          <div className="space-y-3">
            {p.projects.map((pr) => (
              <div key={pr.project.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-100">{pr.project.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                    {pr.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{pr.project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getFallbackPerson(id: string): PersonDetail {
  return {
    id: "person:santosh-patel",
    name: "Santosh Patel",
    email: "santosh@example.com",
    title: "Full Stack Engineer",
    location: "Mumbai, India",
    experienceYears: 4,
    bio: "Passionate full-stack engineer building products with React, Next.js, Node.js and graph databases. Currently exploring AI/ML integration.",
    createdAt: "2024-01-15",
    skills: [
      { skill: { id: "skill:react", name: "React", category: "Frontend", difficulty: "Intermediate", description: "" }, level: "advanced", years: 3 },
      { skill: { id: "skill:nextjs", name: "Next.js", category: "Frontend", difficulty: "Advanced", description: "" }, level: "advanced", years: 2 },
      { skill: { id: "skill:typescript", name: "TypeScript", category: "Frontend", difficulty: "Intermediate", description: "" }, level: "advanced", years: 3 },
      { skill: { id: "skill:nodejs", name: "Node.js", category: "Backend", difficulty: "Intermediate", description: "" }, level: "intermediate", years: 3 },
      { skill: { id: "skill:neo4j", name: "Neo4j / CognoDB", category: "Database", difficulty: "Advanced", description: "" }, level: "intermediate", years: 2 },
    ],
    projects: [
      { project: { id: "proj:careergraph", name: "CareerGraph", description: "Interactive career & skill knowledge graph SaaS", category: "SaaS", year: 2024 }, role: "Full Stack Developer", duration: "3 months" },
      { project: { id: "proj:hotel-booking", name: "Hotel Booking Platform", description: "Full-stack reservation platform", category: "Travel", year: 2023 }, role: "Full Stack Developer", duration: "4 months" },
    ],
    targetRoles: [
      { id: "role:senior-fullstack", title: "Senior Full Stack Engineer", description: "", level: "Senior", salaryRange: "$160K-$210K" }
    ]
  };
}
