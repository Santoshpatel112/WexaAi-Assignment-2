"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Search, ArrowRight } from "lucide-react";
import { MOCK_SKILLS } from "@/server/db/mock-data";
import { SKILL_CATEGORY_COLORS } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.items) setSkills(res.data.items);
      })
      .catch(() => {});
  }, []);

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Zap className="w-7 h-7 text-blue-400" /> Skill Knowledge Graph Nodes
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Explore technology nodes and their interconnections via RELATED_TO edges.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search skills by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((skill) => (
          <Link
            key={skill.id}
            href={`/skills/${skill.id.replace("skill:", "")}`}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-blue-300 transition-colors">
                      {skill.name}
                    </h3>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block", SKILL_CATEGORY_COLORS[skill.category] || "bg-slate-800 text-slate-400")}>
                      {skill.category}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {skill.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{skill.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>View Related Skills</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
