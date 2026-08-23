"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Zap, ArrowLeft, BookOpen, Users, FolderGit2, Briefcase, ExternalLink } from "lucide-react";
import type { SkillDetail } from "@/types";

export default function SkillDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const skillId = rawId?.startsWith("skill:") ? rawId : `skill:${rawId}`;

  const [skill, setSkill] = useState<SkillDetail | null>(null);

  useEffect(() => {
    if (!skillId) return;
    fetch(`/api/skills/${skillId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setSkill(res.data);
        else setSkill(getFallbackSkill(skillId));
      })
      .catch(() => setSkill(getFallbackSkill(skillId)));
  }, [skillId]);

  const s = skill || getFallbackSkill("skill:react");

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <Link href="/skills" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Skills
      </Link>

      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-5 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
          <Zap className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-100">{s.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold">
              {s.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{s.description}</p>
        </div>
      </div>

      {/* Learning resources */}
      {s.learningResources.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-cyan-400" /> Recommended Learning Resources (:HAS_RESOURCE)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {s.learningResources.map((lr) => (
              <a
                key={lr.id}
                href={lr.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-slate-100 block group-hover:text-cyan-300 transition-colors">
                    {lr.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{lr.provider} • {lr.type}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getFallbackSkill(id: string): SkillDetail {
  return {
    id: "skill:react",
    name: "React",
    category: "Frontend",
    difficulty: "Intermediate",
    description: "UI component library built by Meta for modern web development.",
    people: [],
    projects: [],
    roles: [],
    relatedSkills: [
      { skill: { id: "skill:nextjs", name: "Next.js", category: "Frontend", difficulty: "Advanced", description: "" }, strength: 0.9 },
      { skill: { id: "skill:typescript", name: "TypeScript", category: "Frontend", difficulty: "Intermediate", description: "" }, strength: 0.85 },
    ],
    learningResources: [
      { id: "res:react-docs", title: "React Official Docs", type: "Documentation", url: "https://react.dev", provider: "Meta", difficulty: "Beginner" },
      { id: "res:nextjs-learn", title: "Next.js Learn Course", type: "Tutorial", url: "https://nextjs.org/learn", provider: "Vercel", difficulty: "Intermediate" },
    ]
  };
}
