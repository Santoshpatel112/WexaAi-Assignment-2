"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";

export default function LearningPathPage() {
  const resources = [
    { title: "Docker Deep Dive", type: "Book", provider: "Nigel Poulton", url: "https://www.amazon.com/Docker-Deep-Dive-Nigel-Poulton/dp/1916585256" },
    { title: "AWS Developer Associate", type: "Course", provider: "AWS", url: "https://aws.amazon.com/certification/certified-developer-associate/" },
    { title: "System Design Interview", type: "Book", provider: "Alex Xu", url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-cyan-400" /> Graph Learning Path Roadmap
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Sequential learning resources linked to missing skill nodes via (:Skill)-[:HAS_RESOURCE]&rarr;(:LearningResource).
        </p>
      </div>

      <div className="space-y-4">
        {resources.map((res, i) => (
          <div key={res.title} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                {i + 1}
              </div>
              <div>
                <span className="font-bold text-sm text-slate-100 block">{res.title}</span>
                <span className="text-xs text-slate-400">{res.provider} • {res.type}</span>
              </div>
            </div>
            <a
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              Open Resource <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
