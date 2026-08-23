"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Search, ArrowRight, Building2, Check } from "lucide-react";
import { MOCK_ROLES } from "@/server/db/mock-data";
import type { Role } from "@/types";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/roles")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.items) setRoles(res.data.items);
      })
      .catch(() => {});
  }, []);

  const filtered = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-amber-400" /> Career Roles in Graph
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Target role nodes specifying skill requirements (:REQUIRES_SKILL) and company offerings (:OFFERED_BY).
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles by title or level..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((role) => (
          <Link
            key={role.id}
            href={`/roles/${role.id.replace("role:", "")}`}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors">
                      {role.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/30 inline-block">
                      {role.level} Level
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {role.salaryRange}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{role.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>View Required Skills & Companies</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
