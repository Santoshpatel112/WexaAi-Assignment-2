"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Shield, ArrowLeft, Check, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: "person:santosh-patel", clerkId: "user_2Santosh123", name: "Santosh Patel", email: "santosh@example.com", role: "ADMIN", title: "Full Stack Engineer" },
    { id: "person:sarah-chen", clerkId: "user_2Sarah456", name: "Sarah Chen", email: "sarah@example.com", role: "USER", title: "ML Engineer" },
    { id: "person:elena-volkov", clerkId: "user_2Elena789", name: "Elena Volkov", email: "elena@example.com", role: "USER", title: "Data Engineer" },
  ]);

  const toggleRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: u.role === "ADMIN" ? "USER" : "ADMIN" } : u
      )
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <Link href="/admin" className="text-xs text-purple-400 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-400" /> Admin User Management
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Manage authenticated Clerk user profiles, internal RBAC roles (USER / ADMIN), and graph node links.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((u) => (
          <div key={u.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">{u.name}</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    u.role === "ADMIN"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {u.role}
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                {u.email} • {u.title} • <span className="font-mono text-[10px] text-purple-400">{u.clerkId}</span>
              </span>
            </div>

            <button
              onClick={() => toggleRole(u.id)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" /> Toggle Role to {u.role === "ADMIN" ? "USER" : "ADMIN"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
