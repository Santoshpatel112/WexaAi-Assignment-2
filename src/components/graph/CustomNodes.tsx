"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { User, Zap, FolderGit2, Briefcase, Building2, BookOpen, Check, X, Sparkles } from "lucide-react";
import { cn, matchPercentageColor } from "@/lib/utils";
import type { GraphNodeType } from "@/types";

interface NodeData {
  label: string;
  type: GraphNodeType;
  properties: Record<string, unknown>;
  isSelected?: boolean;
  isDimmed?: boolean;
  isNeighbor?: boolean;
  matchPercentage?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

export const PersonNode = memo(({ data }: { data: NodeData }) => {
  const isSelected = data.isSelected;
  return (
    <div
      className={cn(
        "relative group px-4 py-3 rounded-2xl bg-slate-900/90 border-2 backdrop-blur-md shadow-xl transition-all duration-300 min-w-[200px]",
        isSelected
          ? "border-purple-500 shadow-purple-500/30 shadow-2xl scale-105 ring-4 ring-purple-500/20"
          : "border-purple-500/40 hover:border-purple-400 hover:shadow-purple-500/10",
        data.isDimmed && "opacity-30 scale-95"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-3 !h-3" />
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
          {data.properties?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.properties.avatar as string} alt={data.label} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-slate-100 truncate">{data.label}</span>
            {data.properties?.title === "Full Stack Engineer" && (
              <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
            )}
          </div>
          <p className="text-xs text-purple-300/80 truncate">{String(data.properties?.title ?? "Candidate")}</p>
          {data.properties?.experienceYears !== undefined && (
            <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
              {String(data.properties.experienceYears)} yrs exp
            </span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !w-3 !h-3" />
    </div>
  );
});
PersonNode.displayName = "PersonNode";

export const SkillNode = memo(({ data }: { data: NodeData }) => {
  const isSelected = data.isSelected;
  return (
    <div
      className={cn(
        "relative px-3.5 py-2 rounded-xl bg-slate-900/90 border-2 backdrop-blur-md shadow-lg transition-all duration-300 min-w-[150px]",
        isSelected
          ? "border-blue-500 shadow-blue-500/30 shadow-xl scale-105 ring-2 ring-blue-500/30"
          : "border-blue-500/30 hover:border-blue-400",
        data.isDimmed && "opacity-30 scale-95"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-2.5 !h-2.5" />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400">
          <Zap className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-slate-100 truncate">{data.label}</div>
          <div className="text-[10px] text-blue-300/70 truncate">{String(data.properties?.category ?? "Skill")}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-2.5 !h-2.5" />
    </div>
  );
});
SkillNode.displayName = "SkillNode";

export const ProjectNode = memo(({ data }: { data: NodeData }) => {
  const isSelected = data.isSelected;
  return (
    <div
      className={cn(
        "relative px-3.5 py-2.5 rounded-xl bg-slate-900/90 border-2 backdrop-blur-md shadow-lg transition-all duration-300 min-w-[160px]",
        isSelected
          ? "border-emerald-500 shadow-emerald-500/30 shadow-xl scale-105 ring-2 ring-emerald-500/30"
          : "border-emerald-500/30 hover:border-emerald-400",
        data.isDimmed && "opacity-30 scale-95"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-2.5 !h-2.5" />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
          <FolderGit2 className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-slate-100 truncate">{data.label}</div>
          <div className="text-[10px] text-emerald-300/70 truncate">{String(data.properties?.category ?? "Project")}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-2.5 !h-2.5" />
    </div>
  );
});
ProjectNode.displayName = "ProjectNode";

export const RoleNode = memo(({ data }: { data: NodeData }) => {
  const isSelected = data.isSelected;
  const matchPct = (data.matchPercentage ?? (data.properties?.matchPercentage as number)) ?? 92;
  const matched = data.matchedSkills ?? ["React", "TypeScript", "Node.js"];
  const missing = data.missingSkills ?? ["Docker", "AWS"];

  return (
    <div
      className={cn(
        "relative px-4 py-3 rounded-2xl bg-slate-900/95 border-2 backdrop-blur-md shadow-2xl transition-all duration-300 min-w-[220px]",
        isSelected
          ? "border-amber-400 shadow-amber-500/40 shadow-2xl scale-105 ring-4 ring-amber-400/20"
          : "border-amber-500/40 hover:border-amber-400",
        data.isDimmed && "opacity-30 scale-95"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !w-3 !h-3" />
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Briefcase className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 leading-tight">{data.label}</div>
            <div className="text-[10px] text-amber-300/80">{String(data.properties?.salaryRange ?? "$130K-$175K")}</div>
          </div>
        </div>
        <span className={cn("text-xs font-extrabold px-2 py-0.5 rounded-full border bg-amber-500/10 border-amber-500/30", matchPercentageColor(matchPct))}>
          {matchPct}% Match
        </span>
      </div>

      {/* Match breakdown preview */}
      <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-[10px]">
        <div className="flex items-center gap-1.5 text-emerald-400 flex-wrap">
          {matched.slice(0, 3).map((s) => (
            <span key={s} className="inline-flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              <Check className="w-3 h-3 text-emerald-400" /> {s}
            </span>
          ))}
        </div>
        {missing.length > 0 && (
          <div className="flex items-center gap-1.5 text-rose-400 flex-wrap mt-1">
            {missing.slice(0, 2).map((s) => (
              <span key={s} className="inline-flex items-center gap-0.5 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                <X className="w-3 h-3 text-rose-400" /> {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !w-3 !h-3" />
    </div>
  );
});
RoleNode.displayName = "RoleNode";

export const CompanyNode = memo(({ data }: { data: NodeData }) => {
  const isSelected = data.isSelected;
  return (
    <div
      className={cn(
        "relative px-4 py-2.5 rounded-xl bg-slate-900/90 border-2 backdrop-blur-md shadow-lg transition-all duration-300 min-w-[170px]",
        isSelected
          ? "border-rose-500 shadow-rose-500/30 shadow-xl scale-105 ring-2 ring-rose-500/30"
          : "border-rose-500/30 hover:border-rose-400",
        data.isDimmed && "opacity-30 scale-95"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-rose-500 !w-2.5 !h-2.5" />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0 text-rose-400 font-bold text-xs">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-slate-100 truncate">{data.label}</div>
          <div className="text-[10px] text-rose-300/70 truncate">{String(data.properties?.industry ?? "Company")}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-rose-500 !w-2.5 !h-2.5" />
    </div>
  );
});
CompanyNode.displayName = "CompanyNode";

export const ResourceNode = memo(({ data }: { data: NodeData }) => {
  const isSelected = data.isSelected;
  return (
    <div
      className={cn(
        "relative px-3.5 py-2 rounded-xl bg-slate-900/90 border-2 backdrop-blur-md shadow-lg transition-all duration-300 min-w-[150px]",
        isSelected
          ? "border-cyan-500 shadow-cyan-500/30 shadow-xl scale-105 ring-2 ring-cyan-500/30"
          : "border-cyan-500/30 hover:border-cyan-400",
        data.isDimmed && "opacity-30 scale-95"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-500 !w-2.5 !h-2.5" />
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-semibold text-slate-100 truncate">{data.label}</div>
          <div className="text-[10px] text-cyan-300/70 truncate">{String(data.properties?.provider ?? "Resource")}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-500 !w-2.5 !h-2.5" />
    </div>
  );
});
ResourceNode.displayName = "ResourceNode";

export const nodeTypes = {
  Person: PersonNode,
  Skill: SkillNode,
  Project: ProjectNode,
  Role: RoleNode,
  Company: CompanyNode,
  LearningResource: ResourceNode,
};
