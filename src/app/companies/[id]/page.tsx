"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2, ArrowLeft, Briefcase, MapPin, ExternalLink } from "lucide-react";
import type { CompanyDetail } from "@/types";

export default function CompanyDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const companyId = rawId?.startsWith("company:") ? rawId : `company:${rawId}`;

  const [company, setCompany] = useState<CompanyDetail | null>(null);

  useEffect(() => {
    if (!companyId) return;
    fetch(`/api/companies/${companyId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setCompany(res.data);
        else setCompany(getFallbackCompany(companyId));
      })
      .catch(() => setCompany(getFallbackCompany(companyId)));
  }, [companyId]);

  const c = company || getFallbackCompany("company:wexa-ai");

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <Link href="/companies" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-5 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
          <Building2 className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-100">{c.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold">
              {c.industry}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {c.location}
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Briefcase className="w-5 h-5 text-amber-400" /> Hiring Roles (:HIRING_FOR / :OFFERED_BY)
        </h2>
        <div className="space-y-3">
          {c.roles.map((r) => (
            <Link
              key={r.id}
              href={`/roles/${r.id.replace("role:", "")}`}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all group flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors block">
                  {r.title}
                </span>
                <span className="text-xs text-slate-400">{r.level} Level • {r.salaryRange}</span>
              </div>
              <span className="text-xs text-amber-400 font-semibold">View Role Requirements →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function getFallbackCompany(id: string): CompanyDetail {
  return {
    id: "company:wexa-ai",
    name: "Wexa AI",
    industry: "Artificial Intelligence",
    location: "San Francisco, CA",
    website: "https://wexa.ai",
    roles: [
      { id: "role:ai-engineer", title: "AI Engineer", description: "Build LLM-powered products with RAG pipelines", level: "Mid", salaryRange: "$150K-$200K" },
      { id: "role:graph-engineer", title: "Graph Database Engineer", description: "Design CognoDB openCypher systems", level: "Senior", salaryRange: "$165K-$215K" },
    ]
  };
}
