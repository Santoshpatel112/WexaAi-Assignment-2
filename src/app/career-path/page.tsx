"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  GitBranch, User, Briefcase, Zap, Check, AlertCircle, BookOpen, Clock, Sparkles, Building2, FolderGit2, Plus, Minus, Maximize2, Lock
} from "lucide-react";
import { cn, matchPercentageColor } from "@/lib/utils";
import type { CareerPath, Role } from "@/types";

export default function CareerPathPage() {
  const { user } = useAuth();
  const [personId, setPersonId] = useState(user.id);
  const [roleId, setRoleId] = useState("role:senior-fullstack");
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    fetch("/api/roles")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setRoles(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const calculatePath = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/career-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, targetRoleId: roleId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCareerPath(json.data);
      }
    } catch {
      // Fallback ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchCareerPath = async () => {
      setLoading(true);
      try {
        const r = await fetch("/api/career-path", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personId, targetRoleId: roleId }),
        });
        const json = await r.json();
        if (!cancelled && json.success && json.data) {
          setCareerPath(json.data);
        }
      } catch {
        // Fallback ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCareerPath();

    return () => {
      cancelled = true;
    };
  }, [personId, roleId]);

  const leftSkillName = careerPath?.matchedSkills[0]?.name || "React";
  const middleSkillName = careerPath?.matchedSkills[1]?.name || "TypeScript";
  const rightSkillName = careerPath?.matchedSkills[2]?.name || "Node.js";
  const companyName = careerPath?.recommendedCompanies[0]?.name || "Wexa AI";
  const targetTitle = careerPath?.targetRole.title || "Senior Full Stack Engineer";
  const matchPct = careerPath?.matchPercentage ?? 75;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6 bg-slate-950 dark:bg-slate-950 text-slate-100 dark:text-slate-100 min-h-screen">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <GitBranch className="w-7 h-7 text-purple-400" /> Graph Path
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-0.5">
          Visualize your skill connections and career opportunities dynamically
        </p>
      </div>

      {/* Top Filter Selection Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <select
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value={user.id}>Candidate: {user.name}</option>
            <option value="person:santosh-patel">Candidate: Santosh Patel</option>
            <option value="person:sarah-chen">Candidate: Sarah Chen</option>
            <option value="person:elena-volkov">Candidate: Elena Volkov</option>
          </select>

          <span className="text-slate-500 text-xs font-mono">→</span>

          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
          >
            {roles.length > 0 ? (
              roles.map((r) => (
                <option key={r.id} value={r.id}>
                  Target: {r.title}
                </option>
              ))
            ) : (
              <>
                <option value="role:senior-fullstack">Target: Senior Full Stack Engineer</option>
                <option value="role:fullstack-engineer">Target: Full Stack Developer</option>
                <option value="role:ai-engineer">Target: AI Engineer</option>
                <option value="role:graph-engineer">Target: Graph Database Engineer</option>
              </>
            )}
          </select>
        </div>

        <button
          onClick={calculatePath}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" /> {loading ? "Generating..." : "Generate Path"}
        </button>
      </div>

      {/* MAIN GRAPH CANVAS WITH CRISP NUMERIC SVG VIEWBOX PATHS */}
      <div className="relative w-full h-[580px] rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        {/* Animated Background Grid & Radial Beams */}
        <div className="absolute inset-0 bg-graph-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/15 via-slate-950 to-slate-950 pointer-events-none" />

        {/* Node Types Legend (Top-Left Box) */}
        <div className="absolute top-4 left-4 z-20 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md text-[11px] space-y-1.5 min-w-[130px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Node Types</span>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Candidate
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Skill
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Project
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Job
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Company
          </div>
        </div>

        {/* Relationships Legend (Top-Right Box) */}
        <div className="absolute top-4 right-4 z-20 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md text-[11px] space-y-1 font-mono text-slate-400 min-w-[150px]">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block mb-1">Relationships</span>
          <div>→ HAS_SKILL</div>
          <div>→ WORKED_ON</div>
          <div>→ USES_SKILL</div>
          <div>→ REQUIRES_SKILL</div>
          <div>→ POSTED_BY</div>
        </div>

        {/* SVG CONNECTING LINES WITH VALID NUMERIC VIEWBOX (0 0 1000 580) */}
        <svg
          viewBox="0 0 1000 580"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
            </linearGradient>

            <marker id="arrowHead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* 1. Candidate -> Left Skill */}
          <path d="M 500 105 C 380 135, 200 170, 200 235" fill="none" stroke="url(#purpleGrad)" strokeWidth="3" markerEnd="url(#arrowHead)" />
          <path d="M 500 105 C 380 135, 200 170, 200 235" fill="none" stroke="#a855f7" strokeWidth="4" className="animate-dash-flow" opacity="0.7" />

          {/* 2. Candidate -> Middle Skill / Project */}
          <path d="M 500 105 L 500 235" fill="none" stroke="url(#blueGrad)" strokeWidth="3" markerEnd="url(#arrowHead)" />
          <path d="M 500 105 L 500 235" fill="none" stroke="#60a5fa" strokeWidth="4" className="animate-dash-flow" opacity="0.7" />

          {/* 3. Candidate -> Right Skill */}
          <path d="M 500 105 C 620 135, 800 170, 800 235" fill="none" stroke="url(#purpleGrad)" strokeWidth="3" markerEnd="url(#arrowHead)" />
          <path d="M 500 105 C 620 135, 800 170, 800 235" fill="none" stroke="#a855f7" strokeWidth="4" className="animate-dash-flow" opacity="0.7" />

          {/* 4. Left Skill -> Job Node */}
          <path d="M 200 270 C 200 330, 380 380, 470 410" fill="none" stroke="url(#amberGrad)" strokeWidth="3" markerEnd="url(#arrowHead)" />
          <path d="M 200 270 C 200 330, 380 380, 470 410" fill="none" stroke="#fbbf24" strokeWidth="4" className="animate-dash-flow" opacity="0.7" />

          {/* 5. Middle Skill / Project -> Job Node */}
          <path d="M 500 270 L 500 410" fill="none" stroke="url(#amberGrad)" strokeWidth="3" markerEnd="url(#arrowHead)" />

          {/* 6. Right Skill -> Job Node */}
          <path d="M 800 270 C 800 330, 620 380, 530 410" fill="none" stroke="url(#amberGrad)" strokeWidth="3" markerEnd="url(#arrowHead)" />
          <path d="M 800 270 C 800 330, 620 380, 530 410" fill="none" stroke="#fbbf24" strokeWidth="4" className="animate-dash-flow" opacity="0.7" />

          {/* 7. Job Node -> Company Node */}
          <path d="M 500 440 L 500 500" fill="none" stroke="url(#roseGrad)" strokeWidth="3" markerEnd="url(#arrowHead)" />
          <path d="M 500 440 L 500 500" fill="none" stroke="#f43f5e" strokeWidth="4" className="animate-dash-flow" opacity="0.7" />
        </svg>

        {/* CENTER VISUAL GRAPH TOPOLOGY NODES */}
        <div className="relative w-full h-full flex flex-col items-center justify-between py-8 px-4 z-20">
          {/* Level 1: Candidate Node (Top) */}
          <div className="relative flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-2xl shadow-purple-500/40 ring-4 ring-purple-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <span className="font-bold text-sm text-slate-100 mt-1">{careerPath?.person.name || user.name}</span>
            <span className="text-[10px] text-purple-400 font-mono">Candidate</span>

            {/* Relationship Badges */}
            <span className="absolute -bottom-6 left-1/4 transform -translate-x-full text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-purple-500/40 text-purple-300 shadow-md">
              HAS_SKILL
            </span>
            <span className="absolute -bottom-6 right-1/4 transform translate-x-full text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-purple-500/40 text-purple-300 shadow-md">
              HAS_SKILL
            </span>
          </div>

          {/* Level 2: Middle Skills & Project Nodes (3 Columns) */}
          <div className="w-full max-w-2xl flex items-center justify-between relative my-2">
            {/* Left Skill */}
            <div className="flex flex-col items-center group">
              <div className="w-13 h-13 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <span className="font-bold text-xs text-slate-100 mt-1">{leftSkillName}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Skill</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-amber-500/40 text-amber-300 mt-1 shadow-md">
                REQUIRES_SKILL
              </span>
            </div>

            {/* Center Project / Skill */}
            <div className="flex flex-col items-center group">
              <div className="w-13 h-13 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <span className="font-bold text-xs text-slate-100 mt-1">{middleSkillName}</span>
              <span className="text-[10px] text-blue-400 font-mono">Skill / Project</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-blue-500/40 text-blue-300 mt-1 shadow-md">
                USES_SKILL
              </span>
            </div>

            {/* Right Skill */}
            <div className="flex flex-col items-center group">
              <div className="w-13 h-13 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <span className="font-bold text-xs text-slate-100 mt-1">{rightSkillName}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Skill</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-amber-500/40 text-amber-300 mt-1 shadow-md">
                REQUIRES_SKILL
              </span>
            </div>
          </div>

          {/* Level 3: Job Node (Center Amber) */}
          <div className="relative flex flex-col items-center group">
            <div className="w-15 h-15 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-2xl shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-7 h-7" />
            </div>
            <span className="font-bold text-sm text-slate-100 mt-1">{targetTitle}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mt-0.5">
              {matchPct}% Match
            </span>
          </div>

          {/* Level 4: Company Node (Bottom Rose) */}
          <div className="relative flex flex-col items-center group">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-rose-500/40 text-rose-300 mb-1 shadow-md">
              POSTED_BY
            </span>
            <div className="w-13 h-13 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs text-slate-100 mt-1">{companyName}</span>
            <span className="text-[10px] text-rose-400 font-mono">Company</span>
          </div>
        </div>

        {/* Bottom Left Canvas Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl text-slate-300 backdrop-blur-md">
          <button className="p-1.5 hover:bg-slate-800 rounded-lg"><Plus className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg"><Minus className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg"><Maximize2 className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg"><Lock className="w-4 h-4" /></button>
        </div>

        {/* Bottom Right Mini-map Thumbnail */}
        <div className="absolute bottom-4 right-4 z-20 w-32 h-20 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex items-center justify-center backdrop-blur-md">
          <div className="w-full h-full border border-slate-800/80 rounded-xl relative bg-slate-950 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 absolute top-2" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 absolute left-4 top-8" />
            <div className="w-2 h-2 rounded-full bg-blue-400 absolute center top-8" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 absolute right-4 top-8" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute bottom-6" />
            <div className="w-2 h-2 rounded-full bg-rose-400 absolute bottom-1.5" />
          </div>
        </div>
      </div>

      {/* BOTTOM SUMMARY STATS PANEL */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 backdrop-blur-xl">
        {/* Match Score */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Match Score</span>
          <span className="text-4xl font-black text-emerald-400 block">{matchPct}%</span>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${matchPct}%` }}
            />
          </div>
        </div>

        {/* Matched Skills */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Matched Skills</span>
          <div className="flex flex-wrap gap-2">
            {(careerPath?.matchedSkills.map((s) => s.name) || ["React", "Node.js", "TypeScript"]).map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Missing Skills</span>
          <div className="flex flex-wrap gap-2">
            {(careerPath?.skillGaps.map((g) => g.skill.name) || ["Docker", "AWS", "Kubernetes"]).map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
