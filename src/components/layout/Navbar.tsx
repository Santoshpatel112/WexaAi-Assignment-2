"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { siteConfig, navItems } from "@/config/site";
import { CareerChatbot } from "@/components/chatbot/CareerChatbot";
import {
  Network, Search, LayoutDashboard, Users, Zap, Briefcase, Building2, GitBranch, Sparkles, Command, ChevronDown, UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Network,
  Users,
  Zap,
  Briefcase,
  Building2,
  GitBranch,
};

export function Navbar() {
  const pathname = usePathname();
  const { user, switchUser, availableUsers } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Network className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] text-purple-400 font-mono -mt-1 font-semibold">CognoDB User-Driven SaaS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon] || Network;
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                      isActive
                        ? "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-purple-400" : "text-slate-500")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls & User Switcher */}
          <div className="flex items-center gap-3">
            {/* Onboarding Button */}
            <Link
              href="/onboarding"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" /> Onboarding
            </Link>

            {/* User Switcher Dropdown (Allows instant User A vs User B testing!) */}
            <div className="relative flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-purple-500/20">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>

              <select
                value={user.id}
                onChange={(e) => switchUser(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>
      <CareerChatbot />
    </>
  );
}
