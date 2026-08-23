"use client";

import React from "react";
import { X, Sparkles, ExternalLink, Zap, Layers, User, Briefcase, Building2, BookOpen, FolderGit2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GraphNode, GraphEdge } from "@/types";

interface NodeInspectorProps {
  node: GraphNode | null;
  edges: GraphEdge[];
  allNodes: GraphNode[];
  onClose: () => void;
  onExpand: (nodeId: string, nodeType: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function NodeInspector({
  node,
  edges,
  allNodes,
  onClose,
  onExpand,
  onSelectNode,
}: NodeInspectorProps) {
  if (!node) return null;

  const connectedEdges = edges.filter(
    (e) => e.source === node.id || e.target === node.id
  );

  const connectedNodeIds = new Set(
    connectedEdges.map((e) => (e.source === node.id ? e.target : e.source))
  );

  const connectedNodes = allNodes.filter((n) => connectedNodeIds.has(n.id));

  const nodeIcon = () => {
    switch (node.type) {
      case "Person": return <User className="w-5 h-5 text-purple-400" />;
      case "Skill": return <Zap className="w-5 h-5 text-blue-400" />;
      case "Project": return <FolderGit2 className="w-5 h-5 text-emerald-400" />;
      case "Role": return <Briefcase className="w-5 h-5 text-amber-400" />;
      case "Company": return <Building2 className="w-5 h-5 text-rose-400" />;
      case "LearningResource": return <BookOpen className="w-5 h-5 text-cyan-400" />;
      default: return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const badgeColor = () => {
    switch (node.type) {
      case "Person": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Skill": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Project": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Role": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Company": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "LearningResource": return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 w-80 md:w-96 max-h-[calc(100vh-6rem)] bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl border flex items-center justify-center", badgeColor())}>
            {nodeIcon()}
          </div>
          <div>
            <span className={cn("text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border inline-block mb-1", badgeColor())}>
              {node.type}
            </span>
            <h3 className="text-base font-bold text-slate-100 leading-snug">{node.label}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body scroll */}
      <div className="p-4 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
        {/* Node specific highlights */}
        {node.type === "Role" && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Role Match Analysis</span>
              <span className="font-extrabold text-amber-400 text-sm">92% Match</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full w-[92%]" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 4 Matched Skills
              </div>
              <div className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> 2 Missing Skills
              </div>
            </div>
          </div>
        )}

        {/* Properties */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Properties</h4>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2">
            {Object.entries(node.properties || {}).map(([key, val]) => {
              if (key === "id" || val === undefined || val === null) return null;
              return (
                <div key={key} className="flex justify-between items-center text-xs py-0.5 border-b border-slate-800/40 last:border-0">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-medium text-slate-200 truncate max-w-[180px]">
                    {String(val)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Connections ({connectedNodes.length})
            </h4>
            <button
              onClick={() => onExpand(node.id, node.type)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Sparkles className="w-3 h-3" /> Expand Graph
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {connectedNodes.map((cnNode) => {
              const rel = connectedEdges.find(
                (e) => e.source === cnNode.id || e.target === cnNode.id
              );
              return (
                <div
                  key={cnNode.id}
                  onClick={() => onSelectNode(cnNode.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800 cursor-pointer transition-all hover:border-slate-700"
                >
                  <div className="overflow-hidden">
                    <span className="text-slate-200 font-semibold block truncate">{cnNode.label}</span>
                    <span className="text-[10px] text-slate-400">{cnNode.type}</span>
                  </div>
                  {rel && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-purple-300 rounded border border-slate-700">
                      {rel.type}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
        <button
          onClick={() => onExpand(node.id, node.type)}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Expand Neighbors
        </button>
      </div>
    </div>
  );
}
