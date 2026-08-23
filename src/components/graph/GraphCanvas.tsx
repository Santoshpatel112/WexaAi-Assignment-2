"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./CustomNodes";
import { NodeInspector } from "./NodeInspector";
import { Search, Filter, ZoomIn, RefreshCw, Sparkles, Layers, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GraphData, GraphNode, GraphEdge, GraphNodeType } from "@/types";

interface GraphCanvasProps {
  initialGraph: GraphData;
}

export function GraphCanvas({ initialGraph }: GraphCanvasProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("person:santosh-patel");
  const [searchQuery, setSearchQuery] = useState("");
  const [nodeTypeFilter, setNodeTypeFilter] = useState<Record<string, boolean>>({
    Person: true,
    Skill: true,
    Project: true,
    Role: true,
    Company: true,
    LearningResource: true,
  });

  // Transform GraphNode → ReactFlow Node
  const rawNodesToFlow = useCallback((nodes: GraphNode[], selId: string | null) => {
    // Generate circular layout coordinates if not present
    const count = nodes.length;
    const radius = Math.min(300 + count * 15, 600);

    return nodes.map((n, i) => {
      const angle = (i / Math.max(count, 1)) * 2 * Math.PI;
      const x = 500 + radius * Math.cos(angle) + (i % 2 === 0 ? 40 : -40);
      const y = 350 + radius * Math.sin(angle) + (i % 3 === 0 ? 30 : -30);

      const isSel = n.id === selId;

      return {
        id: n.id,
        type: n.type,
        position: { x, y },
        data: {
          label: n.label,
          type: n.type,
          properties: n.properties,
          isSelected: isSel,
        },
      } as Node;
    });
  }, []);

  // Transform GraphEdge → ReactFlow Edge
  const rawEdgesToFlow = useCallback((edges: GraphEdge[], selId: string | null) => {
    return edges.map((e) => {
      const isConnectedToSel = e.source === selId || e.target === selId;
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.type,
        animated: isConnectedToSel,
        style: {
          stroke: isConnectedToSel ? "#a855f7" : "#475569",
          strokeWidth: isConnectedToSel ? 3 : 1.5,
          opacity: isConnectedToSel ? 1 : 0.6,
        },
        labelStyle: { fill: "#cbd5e1", fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: "#0f172a", rx: 4, ry: 4 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isConnectedToSel ? "#a855f7" : "#475569",
        },
      } as Edge;
    });
  }, []);

  const [rawNodes, setRawNodes] = useState<GraphNode[]>(initialGraph.nodes);
  const [rawEdges, setRawEdges] = useState<GraphEdge[]>(initialGraph.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    rawNodesToFlow(initialGraph.nodes, "person:santosh-patel")
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    rawEdgesToFlow(initialGraph.edges, "person:santosh-patel")
  );

  // Filter nodes based on type and search query
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const passesType = nodeTypeFilter[n.type as string] !== false;
      const passesSearch =
        !searchQuery ||
        (n.data.label as string).toLowerCase().includes(searchQuery.toLowerCase());
      return passesType && passesSearch;
    });
  }, [nodes, nodeTypeFilter, searchQuery]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isSelected: n.id === node.id,
          },
        }))
      );
      setEdges((eds) =>
        eds.map((e) => {
          const isConn = e.source === node.id || e.target === node.id;
          return {
            ...e,
            animated: isConn,
            style: {
              ...e.style,
              stroke: isConn ? "#a855f7" : "#475569",
              strokeWidth: isConn ? 3 : 1.5,
            },
          };
        })
      );
    },
    [setNodes, setEdges]
  );

  const handleExpandNode = useCallback(async (nodeId: string, nodeType: string) => {
    try {
      const res = await fetch("/api/graph/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId, nodeType, depth: 1 }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const newNodes: GraphNode[] = json.data.nodes;
        const newEdges: GraphEdge[] = json.data.edges;

        setRawNodes((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const additions = newNodes.filter((n) => !existingIds.has(n.id));
          return [...prev, ...additions];
        });

        setRawEdges((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const additions = newEdges.filter((e) => !existingIds.has(e.id));
          return [...prev, ...additions];
        });
      }
    } catch {
      // Graceful error handle
    }
  }, []);

  useEffect(() => {
    setNodes(rawNodesToFlow(rawNodes, selectedNodeId));
    setEdges(rawEdgesToFlow(rawEdges, selectedNodeId));
  }, [rawNodes, rawEdges, selectedNodeId, rawNodesToFlow, rawEdgesToFlow, setNodes, setEdges]);

  const selectedNodeObj = useMemo(() => {
    return rawNodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [rawNodes, selectedNodeId]);

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-slate-950 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-graph-grid bg-graph-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-slate-950 pointer-events-none" />

      {/* Floating Toolbar Header */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-3 bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-2.5 rounded-2xl shadow-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search graph nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-xl focus:outline-none focus:border-purple-500 w-48 md:w-64"
          />
        </div>

        {/* Node Filters dropdown/toggles */}
        <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-800">
          {(["Person", "Skill", "Project", "Role", "Company"] as GraphNodeType[]).map((type) => (
            <button
              key={type}
              onClick={() =>
                setNodeTypeFilter((prev) => ({ ...prev, [type]: !prev[type] }))
              }
              className={cn(
                "px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all",
                nodeTypeFilter[type]
                  ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-500"
              )}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        className="bg-transparent"
      >
        <Background color="#334155" gap={40} size={1} />
        <Controls className="!bg-slate-900/90 !border-slate-800 !text-slate-200 rounded-xl shadow-xl overflow-hidden" />
      </ReactFlow>

      {/* Node Inspector right panel */}
      <NodeInspector
        node={selectedNodeObj}
        edges={rawEdges}
        allNodes={rawNodes}
        onClose={() => setSelectedNodeId(null)}
        onExpand={handleExpandNode}
        onSelectNode={(id) => setSelectedNodeId(id)}
      />
    </div>
  );
}
