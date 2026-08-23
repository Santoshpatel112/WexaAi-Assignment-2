"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { siteConfig } from "@/config/site";
import { UserButton, Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Network, Search, LayoutDashboard, Users, Zap, Briefcase, Building2, GitBranch,
  Target, BookOpen, Bookmark, Send, Bell, HelpCircle, LogOut, Settings, ShieldAlert,
  Sparkles, Check, ChevronDown, Menu, X, ArrowUpRight, PanelRightClose, PanelRightOpen,
  PanelLeftClose, PanelLeftOpen, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage, RoleMatch } from "@/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchUser, availableUsers, logout } = useAuth();

  // Layout States (Locked to sleek Blue/Black SaaS Theme)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [assistantCollapsed, setAssistantCollapsed] = useState(true);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "assistant",
      text: `Hello ${user.name.split(" ")[0]}! 👋\n\nI can help you find the best career opportunities, analyze skill gaps, and recommend learning paths.\n\nWhat would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [roleMatches, setRoleMatches] = useState<RoleMatch[]>([]);

  useEffect(() => {
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: user.id }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setRoleMatches(res.data);
      })
      .catch(() => {});
  }, [user.id]);

  const handleSendChat = async (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, message: textToSend }),
      });
      const json = await res.json();
      if (json.success && json.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: "assistant",
            text: json.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      // Degraded response
    } finally {
      setChatLoading(false);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Graph Explorer", href: "/graph", icon: Network },
    { label: "People", href: "/people", icon: Users },
    { label: "Skills", href: "/skills", icon: Zap },
    { label: "Roles", href: "/roles", icon: Briefcase },
    { label: "Companies", href: "/companies", icon: Building2 },
    { label: "Career Path", href: "/career-path", icon: GitBranch },
    { label: "Skill Gap", href: "/skill-gap", icon: Target },
    { label: "Learning Path", href: "/learning-path", icon: BookOpen },
    { label: "Jobs", href: "/jobs", icon: Briefcase },
    { label: "Saved", href: "/saved", icon: Bookmark },
    { label: "Applications", href: "/applications", icon: Briefcase },
  ];

  const secondaryNavItems = [
    { label: "Admin Portal", href: "/admin", icon: ShieldAlert },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Help & Docs", href: "https://console.cognodb.com", icon: HelpCircle, external: true },
  ];

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
  if (isPublicPage) return <>{children}</>;

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 lg:static lg:translate-x-0 border-r bg-slate-900/95 border-slate-800/80",
          sidebarCollapsed ? "w-20" : "w-64",
          mobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-2.5 group overflow-hidden" title="Go to Home Page">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Network className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="font-black text-sm tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                    {siteConfig.name}
                  </span>
                  <span className="text-[9px] text-purple-400 font-mono -mt-1 font-semibold truncate">Graph Database SaaS</span>
                </div>
              )}
            </Link>

            {/* Minimize / Collapse Sidebar Button Icon */}
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              title={sidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-purple-400" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all group",
                    isActive
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300")} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-800/60 my-2 space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    title={sidebarCollapsed ? item.label : undefined}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}

              <button
                onClick={() => { logout(); router.push("/login"); }}
                title={sidebarCollapsed ? "Logout" : undefined}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 font-medium transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-slate-500 flex-shrink-0" />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>

          {/* Bottom Active User Pill */}
          <div className="p-2.5 border-t bg-slate-950/60 border-slate-800/80">
            <div className="p-2 rounded-2xl flex items-center justify-between border bg-slate-900 border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-extrabold shadow-md flex-shrink-0">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
                {!sidebarCollapsed && (
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold block truncate text-slate-200">{user.name}</span>
                    <span className="text-[10px] text-purple-400 font-mono block truncate">{user.title}</span>
                  </div>
                )}
              </div>

              {!sidebarCollapsed && (
                <select
                  value={user.id}
                  onChange={(e) => switchUser(e.target.value)}
                  className="bg-transparent text-slate-400 text-xs focus:outline-none cursor-pointer text-right w-5"
                  title="Switch Demo User"
                >
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200 text-xs">
                      {u.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CENTER CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 px-4 md:px-6 flex items-center justify-between gap-4 flex-shrink-0 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-slate-200">
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything... (⌘K)"
                className="pl-9 pr-4 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-purple-500 w-56 sm:w-80 bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Clerk User Account Button */}
            <UserButton />

            {/* Notifications */}
            <button className="relative p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-slate-950" />
            </button>

            {/* Toggle Assistant Panel Button */}
            <button
              onClick={() => setAssistantCollapsed((prev) => !prev)}
              className={cn(
                "p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer",
                !assistantCollapsed
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-slate-900 border-slate-800 text-purple-400 hover:text-purple-300 hover:border-slate-700"
              )}
              title={assistantCollapsed ? "Open Career Assistant" : "Minimize Career Assistant"}
            >
              {!assistantCollapsed ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              <span>Assistant</span>
            </button>
          </div>
        </header>

        {/* Center Page Scroll Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">{children}</main>
      </div>

      {/* 3. RIGHT SIDEBAR ASSISTANT PANEL */}
      {!assistantCollapsed && (
        <aside className="hidden xl:flex w-80 lg:w-96 border-l border-slate-800/80 bg-slate-950/95 flex-col h-full flex-shrink-0 overflow-hidden transition-all duration-300">
          {/* Assistant Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                  Career Assistant
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Grok AI Powered
                </span>
              </div>
            </div>

            {/* Minimize / Close Panel Button */}
            <button
              onClick={() => setAssistantCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Minimize Assistant Panel"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Conversation */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar text-xs">
            {/* Initial Assistant welcome */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 space-y-2 leading-relaxed">
              <p>Hello <strong>{user.name.split(" ")[0]}</strong>! 👋</p>
              <p>I can help you find the best career opportunities, analyze skill gaps, and recommend learning paths.</p>
              <p className="text-slate-400 text-[11px]">What would you like to explore?</p>
            </div>

            {/* Prompt Chips */}
            <button
              onClick={() => handleSendChat("Show me the best job matches for my current skills")}
              className="w-full text-left p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all"
            >
              Show me the best job matches for my current skills
            </button>

            {/* Top Job Matches Cards Preview */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Here are your top job matches:</span>
              
              {roleMatches.slice(0, 3).map((m) => (
                <div key={m.role.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-slate-100 block">{m.role.title}</span>
                      <span className="text-[10px] text-slate-400">Wexa AI • Remote</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-400">{m.matchPercentage}% Match</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {m.matchedSkills.slice(0, 3).map((s) => (
                      <span key={s.id} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Thread */}
            {messages.slice(1).map((m) => (
              <div
                key={m.id}
                className={cn(
                  "p-3 rounded-2xl leading-relaxed text-xs",
                  m.sender === "user"
                    ? "bg-purple-600 text-white ml-auto max-w-[85%]"
                    : "bg-slate-900 border border-slate-800 text-slate-200 mr-auto max-w-[90%]"
                )}
              >
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
            ))}

            {chatLoading && (
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-purple-400 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Querying Grok AI & CognoDB...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask me anything about your career..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSendChat()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* FLOATING CHATBOT ICON IN BOTTOM RIGHT */}
      <button
        onClick={() => setAssistantCollapsed(!assistantCollapsed)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group ring-4 ring-purple-500/20"
        title="Toggle Grok Career Assistant"
      >
        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
      </button>
    </div>
  );
}
