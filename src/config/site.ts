// ============================================
// Site Configuration
// ============================================

export const siteConfig = {
  name: "CareerGraph",
  tagline: "Your Career Is a Graph.",
  description:
    "Explore the relationships between people, skills, projects, roles and companies. Career decisions are about relationships, not rows.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  version: "1.0.0",
};

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Graph", href: "/graph", icon: "Network" },
  { label: "People", href: "/people", icon: "Users" },
  { label: "Skills", href: "/skills", icon: "Zap" },
  { label: "Roles", href: "/roles", icon: "Briefcase" },
  { label: "Companies", href: "/companies", icon: "Building2" },
  { label: "Career Path", href: "/career-path", icon: "GitBranch" },
] as const;

// ============================================
// Graph Node Colors (matching Tailwind config)
// ============================================

export const NODE_COLORS: Record<string, string> = {
  Person: "#7C3AED",       // purple
  Skill: "#2563EB",        // blue
  Project: "#10B981",      // emerald
  Role: "#F59E0B",         // amber
  Company: "#F43F5E",      // rose
  LearningResource: "#06B6D4", // cyan
};

export const NODE_BG_COLORS: Record<string, string> = {
  Person: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  Skill: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  Project: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  Role: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  Company: "bg-rose-500/10 border-rose-500/30 text-rose-400",
  LearningResource: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
};

export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Backend: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Database: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DevOps: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Cloud: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "AI/ML": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Mobile: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Design: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Architecture: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Testing: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "Data Engineering": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Security: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Advanced: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Expert: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export const LEVEL_COLORS: Record<string, string> = {
  Junior: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Mid: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Senior: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Lead: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Principal: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Staff: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

// ============================================
// Pagination
// ============================================

export const DEFAULT_PAGE_SIZE = 12;
export const GRAPH_INITIAL_LIMIT = 30;
export const GRAPH_EXPAND_LIMIT = 20;
