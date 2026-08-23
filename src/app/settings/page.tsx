"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Settings, User, Zap, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, name, title });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8 bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <Settings className="w-7 h-7 text-purple-400" /> Account & Profile Settings
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Manage your authenticated identity, title, and CognoDB node properties.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Current Role Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          {saved ? "Profile Graph Saved!" : "Save Profile Changes"}
        </button>
      </form>
    </div>
  );
}
