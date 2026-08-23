import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatExperience(years: number): string {
  if (years === 0) return "< 1 year";
  if (years === 1) return "1 year";
  return `${years} years`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function matchPercentageColor(pct: number): string {
  if (pct >= 80) return "text-emerald-400";
  if (pct >= 60) return "text-amber-400";
  if (pct >= 40) return "text-orange-400";
  return "text-rose-400";
}

export function matchPercentageBg(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 60) return "bg-amber-500";
  if (pct >= 40) return "bg-orange-500";
  return "bg-rose-500";
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateAvatarColor(name: string): string {
  const colors = [
    "#7C3AED", "#2563EB", "#10B981", "#F59E0B",
    "#F43F5E", "#06B6D4", "#8B5CF6", "#EC4899",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
