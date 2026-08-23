"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, User, MapPin, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import { MOCK_PEOPLE } from "@/server/db/mock-data";
import type { Person } from "@/types";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>(MOCK_PEOPLE);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/people")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.items) setPeople(res.data.items);
      })
      .catch(() => {});
  }, []);

  const filtered = people.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-400" /> People in CareerGraph
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Browse engineers, architects, and AI practitioners connected through skill and project nodes.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, role, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-full sm:w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((person) => (
          <Link
            key={person.id}
            href={`/people/${person.id.replace("person:", "")}`}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all group hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                  {person.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-purple-300 transition-colors truncate">
                    {person.name}
                  </h3>
                  <p className="text-xs text-purple-400 font-medium truncate">{person.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{person.bio}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {person.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {person.experienceYears} yrs exp
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Inspect Person Graph</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
