"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Search, ArrowRight, MapPin, Globe } from "lucide-react";
import { MOCK_COMPANIES } from "@/server/db/mock-data";
import type { Company } from "@/types";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.items) setCompanies(res.data.items);
      })
      .catch(() => {});
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-rose-400" /> Companies in CareerGraph
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Company nodes connected to roles (:HIRING_FOR / :OFFERED_BY) and candidate network paths.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 w-full sm:w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.id.replace("company:", "")}`}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-rose-300 transition-colors">
                    {company.name}
                  </h3>
                  <span className="text-xs text-rose-400 font-medium">{company.industry}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {company.location}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-rose-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Inspect Company Roles</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
