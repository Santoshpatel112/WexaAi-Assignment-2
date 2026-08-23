"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { Loader2 } from "lucide-react";
import type { GraphData, GraphNode, GraphEdge } from "@/types";

export default function GraphPage() {
  const { user } = useAuth();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/graph?userId=${encodeURIComponent(user.id)}&limit=30`);
      const json = await res.json();
      if (json.success && json.data?.graph) {
        setGraphData(json.data.graph);
      } else {
        setGraphData(getUserFallbackGraph(user.id, user.name, user.title));
      }
    } catch {
      setGraphData(getUserFallbackGraph(user.id, user.name, user.title));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-400 gap-4">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <div className="text-sm font-semibold">Generating Personalized Graph Topology for {user.name}...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      <GraphCanvas initialGraph={graphData || getUserFallbackGraph(user.id, user.name, user.title)} />
    </div>
  );
}

function getUserFallbackGraph(userId: string, userName: string, title: string): GraphData {
  const isSarah = userId.includes("sarah");
  const isElena = userId.includes("elena");

  if (isSarah) {
    // User B: ML Engineer topology
    return {
      nodes: [
        { id: userId, type: "Person", label: userName, properties: { title, experienceYears: 5 } },
        { id: "skill:python", type: "Skill", label: "Python", properties: { category: "Backend" } },
        { id: "skill:pytorch", type: "Skill", label: "PyTorch", properties: { category: "AI/ML" } },
        { id: "skill:ml", type: "Skill", label: "Machine Learning", properties: { category: "AI/ML" } },
        { id: "skill:aws", type: "Skill", label: "AWS", properties: { category: "Cloud" } },
        { id: "proj:price-predictor", type: "Project", label: "ML Price Predictor", properties: { category: "AI" } },
        { id: "role:ml-engineer", type: "Role", label: "ML Engineer", properties: { salaryRange: "$170K-$230K", level: "Senior" } },
        { id: "company:hugging-face", type: "Company", label: "Hugging Face", properties: { industry: "AI / Open Source" } },
      ],
      edges: [
        { id: "e1", source: userId, target: "skill:python", type: "HAS_SKILL", properties: {} },
        { id: "e2", source: userId, target: "skill:pytorch", type: "HAS_SKILL", properties: {} },
        { id: "e3", source: userId, target: "skill:ml", type: "HAS_SKILL", properties: {} },
        { id: "e4", source: userId, target: "proj:price-predictor", type: "WORKED_ON", properties: {} },
        { id: "e5", source: "proj:price-predictor", target: "skill:pytorch", type: "USES_SKILL", properties: {} },
        { id: "e6", source: "role:ml-engineer", target: "skill:pytorch", type: "REQUIRES_SKILL", properties: {} },
        { id: "e7", source: "role:ml-engineer", target: "company:hugging-face", type: "OFFERED_BY", properties: {} },
      ],
    };
  }

  if (isElena) {
    // User C: Data Engineer topology
    return {
      nodes: [
        { id: userId, type: "Person", label: userName, properties: { title, experienceYears: 6 } },
        { id: "skill:python", type: "Skill", label: "Python", properties: { category: "Backend" } },
        { id: "skill:spark", type: "Skill", label: "Apache Spark", properties: { category: "Data Engineering" } },
        { id: "skill:kafka", type: "Skill", label: "Apache Kafka", properties: { category: "Data Engineering" } },
        { id: "skill:dbt", type: "Skill", label: "dbt", properties: { category: "Data Engineering" } },
        { id: "proj:data-pipeline", type: "Project", label: "ETL Data Pipeline", properties: { category: "Data" } },
        { id: "role:data-engineer", type: "Role", label: "Data Engineer", properties: { salaryRange: "$140K-$185K", level: "Mid" } },
        { id: "company:databricks", type: "Company", label: "Databricks", properties: { industry: "Data & AI" } },
      ],
      edges: [
        { id: "e1", source: userId, target: "skill:spark", type: "HAS_SKILL", properties: {} },
        { id: "e2", source: userId, target: "skill:kafka", type: "HAS_SKILL", properties: {} },
        { id: "e3", source: userId, target: "skill:dbt", type: "HAS_SKILL", properties: {} },
        { id: "e4", source: userId, target: "proj:data-pipeline", type: "WORKED_ON", properties: {} },
        { id: "e5", source: "proj:data-pipeline", target: "skill:spark", type: "USES_SKILL", properties: {} },
        { id: "e6", source: "role:data-engineer", target: "skill:spark", type: "REQUIRES_SKILL", properties: {} },
        { id: "e7", source: "role:data-engineer", target: "company:databricks", type: "OFFERED_BY", properties: {} },
      ],
    };
  }

  // User A: Santosh Patel topology
  return {
    nodes: [
      { id: userId, type: "Person", label: userName, properties: { title, experienceYears: 4 } },
      { id: "skill:react", type: "Skill", label: "React", properties: { category: "Frontend" } },
      { id: "skill:nextjs", type: "Skill", label: "Next.js", properties: { category: "Frontend" } },
      { id: "skill:typescript", type: "Skill", label: "TypeScript", properties: { category: "Frontend" } },
      { id: "skill:nodejs", type: "Skill", label: "Node.js", properties: { category: "Backend" } },
      { id: "skill:neo4j", type: "Skill", label: "Neo4j / CognoDB", properties: { category: "Database" } },
      { id: "proj:careergraph", type: "Project", label: "CareerGraph", properties: { category: "SaaS" } },
      { id: "role:fullstack-engineer", type: "Role", label: "Full Stack Engineer", properties: { salaryRange: "$130K-$175K", level: "Mid" } },
      { id: "company:wexa-ai", type: "Company", label: "Wexa AI", properties: { industry: "Artificial Intelligence" } },
    ],
    edges: [
      { id: "e1", source: userId, target: "skill:react", type: "HAS_SKILL", properties: {} },
      { id: "e2", source: userId, target: "skill:nextjs", type: "HAS_SKILL", properties: {} },
      { id: "e3", source: userId, target: "skill:typescript", type: "HAS_SKILL", properties: {} },
      { id: "e4", source: userId, target: "skill:neo4j", type: "HAS_SKILL", properties: {} },
      { id: "e5", source: userId, target: "proj:careergraph", type: "WORKED_ON", properties: {} },
      { id: "e6", source: "proj:careergraph", target: "skill:neo4j", type: "USES_SKILL", properties: {} },
      { id: "e7", source: "role:fullstack-engineer", target: "skill:react", type: "REQUIRES_SKILL", properties: {} },
      { id: "e8", source: "role:fullstack-engineer", target: "skill:typescript", type: "REQUIRES_SKILL", properties: {} },
      { id: "e9", source: "role:fullstack-engineer", target: "company:wexa-ai", type: "OFFERED_BY", properties: {} },
    ],
  };
}
