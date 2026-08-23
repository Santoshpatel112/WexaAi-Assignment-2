"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, User, Zap, FolderGit2, Briefcase, Check, ArrowRight, ArrowLeft, Plus, Trash2, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillCategory, SkillLevel } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [currentRole, setCurrentRole] = useState("Full Stack Developer");
  const [experienceYears, setExperienceYears] = useState(3);
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState("Building high performance web applications & graph systems.");

  // Step 2: Skills
  const [skills, setSkills] = useState<Array<{ name: string; category: SkillCategory; level: SkillLevel; years: number }>>([
    { name: "React", category: "Frontend", level: "advanced", years: 3 },
    { name: "TypeScript", category: "Frontend", level: "advanced", years: 2 },
    { name: "Node.js", category: "Backend", level: "intermediate", years: 2 },
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Frontend");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>("intermediate");
  const [newSkillYears, setNewSkillYears] = useState(2);

  // Step 3: Projects
  const [projects, setProjects] = useState<Array<{ name: string; description: string; technologies: string[]; githubUrl?: string; role: string }>>([
    { name: "Personal SaaS Portfolio", description: "Full stack dashboard with interactive visualizations.", technologies: ["React", "TypeScript"], role: "Creator" },
  ]);
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("");

  // Step 4: Preferences
  const [targetRoleId, setTargetRoleId] = useState("role:fullstack-engineer");
  const [workStyle, setWorkStyle] = useState<"remote" | "hybrid" | "onsite">("remote");

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((prev) => [
      ...prev,
      { name: newSkillName.trim(), category: newSkillCategory, level: newSkillLevel, years: newSkillYears },
    ]);
    setNewSkillName("");
  };

  const removeSkill = (idx: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  const addProject = () => {
    if (!projName.trim()) return;
    setProjects((prev) => [
      ...prev,
      {
        name: projName.trim(),
        description: projDesc.trim() || "Full stack software project",
        technologies: projTech ? projTech.split(",").map((t) => t.trim()) : ["React"],
        role: "Full Stack Developer",
      },
    ]);
    setProjName("");
    setProjDesc("");
    setProjTech("");
  };

  const removeProject = (idx: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleComplete = async () => {
    setLoading(true);
    const userId = `person:user-${Date.now()}`;
    const payload = {
      userId,
      name: fullName || "New Developer",
      title: currentRole,
      experienceYears,
      location,
      bio,
      skills,
      projects,
      preferences: {
        targetRoleId,
        preferredLocation: location,
        workStyle,
      },
    };

    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const newUserSession = {
        id: userId,
        name: payload.name,
        email: `${userId.replace("person:", "")}@example.com`,
        title: payload.title,
        hasCompletedOnboarding: true,
      };

      // Save custom user to localStorage
      localStorage.setItem("careergraph_custom_user", JSON.stringify(newUserSession));
      localStorage.setItem("careergraph_user_id", userId);
      setUser(newUserSession);

      router.push("/graph");
    } catch {
      router.push("/graph");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-purple-600/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Header Step indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-100">JobGraph Onboarding</h1>
              <p className="text-[11px] text-purple-400">Step {step} of 5</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-6 h-1.5 rounded-full transition-all",
                  s <= step ? "bg-purple-500" : "bg-slate-800"
                )}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Basic Profile */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" /> Step 1 — Basic Profile Info
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Current Role Title</label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Skills */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" /> Step 2 — Add Your Core Skills
            </h2>

            {/* Added Skills list */}
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-2xl">
              {skills.map((s, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
                  <span>{s.name} ({s.level})</span>
                  <button onClick={() => removeSkill(i)} className="text-blue-400 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Controls */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Skill name (e.g. Docker, Python)..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud">Cloud</option>
                  <option value="AI/ML">AI/ML</option>
                </select>
              </div>
              <button
                onClick={addSkill}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Skill Node
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Projects */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-emerald-400" /> Step 3 — Add Highlight Projects
            </h2>

            <div className="space-y-2">
              {projects.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{p.name}</span>
                    <span className="text-slate-400">{p.technologies.join(", ")}</span>
                  </div>
                  <button onClick={() => removeProject(i)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <input
                type="text"
                placeholder="Project Name..."
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated e.g. React, Node.js)..."
                value={projTech}
                onChange={(e) => setProjTech(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
              <button
                onClick={addProject}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Project Node
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Preferences */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-400" /> Step 4 — Target Job Preferences
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Role Node</label>
                <select
                  value={targetRoleId}
                  onChange={(e) => setTargetRoleId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  <option value="role:fullstack-engineer">Full Stack Engineer ($130K-$175K)</option>
                  <option value="role:senior-fullstack">Senior Full Stack Engineer ($160K-$210K)</option>
                  <option value="role:ai-engineer">AI Engineer ($150K-$200K)</option>
                  <option value="role:graph-engineer">Graph Database Engineer ($165K-$215K)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Work Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["remote", "hybrid", "onsite"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setWorkStyle(style)}
                      className={cn(
                        "py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all",
                        workStyle === style
                          ? "bg-purple-500/20 border-purple-500 text-purple-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Build */}
        {step === 5 && (
          <div className="space-y-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-100">Ready to Build Your JobGraph?</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We will generate a personalized graph topology in CognoDB connecting <strong>{fullName || "Your Profile"}</strong> to {skills.length} skills, {projects.length} projects, and your target career role.
            </p>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Generating CognoDB Topology..." : "Build My JobGraph"}
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 5 && (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1 ml-auto"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
