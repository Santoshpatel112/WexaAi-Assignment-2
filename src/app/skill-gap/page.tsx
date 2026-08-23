"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Target, Check, AlertCircle, BookOpen, ArrowRight } from "lucide-react";
import type { RoleMatch } from "@/types";

export default function SkillGapPage() {
  const { user } = useAuth();
  const [roleMatches, setRoleMatches] = useState<RoleMatch[]>([]);

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

  const topMatch = roleMatches[0];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <Target className="w-7 h-7 text-rose-400" /> Graph Skill Gap Analysis
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Compare your stored graph skills against target role requirements to identify missing nodes.
        </p>
      </div>

      {topMatch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Check className="w-5 h-5 text-emerald-400" /> Owned Skills ({topMatch.matchedSkills.length})
            </h3>
            <div className="space-y-2">
              {topMatch.matchedSkills.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{s.name}</span>
                  <span className="text-emerald-400 font-mono">Matched ✓</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertCircle className="w-5 h-5 text-rose-400" /> Missing Skill Gaps ({topMatch.missingSkills.length})
            </h3>
            <div className="space-y-2">
              {topMatch.missingSkills.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{s.name}</span>
                  <Link href="/learning-path" className="text-cyan-400 hover:underline flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> View Resources →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
