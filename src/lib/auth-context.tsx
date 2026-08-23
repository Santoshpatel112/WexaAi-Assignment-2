"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import type { UserSession, UserRole } from "@/types";

interface AuthContextType {
  user: UserSession;
  setUser: (u: UserSession) => void;
  switchUser: (userId: string) => void;
  availableUsers: UserSession[];
  logout: () => void;
}

export const PRESET_USERS: UserSession[] = [
  {
    id: "person:admin-account",
    name: "CareerGraph Admin",
    email: "careergraph@gmail.com",
    title: "System Administrator",
    role: "ADMIN",
    hasCompletedOnboarding: true,
  },
  {
    id: "person:santosh-patel",
    name: "Santosh Patel",
    email: "santoshpatelvns5@gmail.com",
    title: "Full Stack Engineer",
    role: "USER",
    hasCompletedOnboarding: true,
  },
  {
    id: "person:sarah-chen",
    name: "Sarah Chen",
    email: "sarah@example.com",
    title: "ML Engineer",
    role: "USER",
    hasCompletedOnboarding: true,
  },
  {
    id: "person:elena-volkov",
    name: "Elena Volkov",
    email: "elena@example.com",
    title: "Data Engineer",
    role: "USER",
    hasCompletedOnboarding: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const [user, setUser] = useState<UserSession>(PRESET_USERS[1]); // Default Santosh Patel (USER)
  const [availableUsers, setAvailableUsers] = useState<UserSession[]>(PRESET_USERS);

  useEffect(() => {
    let allUsers = [...PRESET_USERS];
    const customUserStr = localStorage.getItem("careergraph_custom_user");

    if (customUserStr) {
      try {
        const customUser = JSON.parse(customUserStr) as UserSession;
        if (!allUsers.some((u) => u.id === customUser.id)) {
          allUsers.push(customUser);
        }
      } catch {
        // Parse error ignore
      }
    }

    // Sync Clerk User if signed in
    if (isLoaded && isSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || "user@clerk.dev";
      const determinedRole: UserRole = (clerkUser.publicMetadata?.role as UserRole) || (email === "careergraph@gmail.com" ? "ADMIN" : "USER");

      const clerkSession: UserSession = {
        id: clerkUser.id.startsWith("person:") ? clerkUser.id : `person:${clerkUser.id}`,
        name: clerkUser.fullName || clerkUser.username || clerkUser.firstName || "Clerk User",
        email: email,
        title: (clerkUser.publicMetadata?.title as string) || "Full Stack Developer",
        role: determinedRole,
        hasCompletedOnboarding: true,
      };

      if (!allUsers.some((u) => u.id === clerkSession.id)) {
        allUsers.unshift(clerkSession);
      }

      setUser(clerkSession);
      localStorage.setItem("careergraph_user_id", clerkSession.id);

      // Persist Clerk user graph node to CognoDB
      fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: clerkSession.id,
          name: clerkSession.name,
          email: clerkSession.email,
          title: clerkSession.title,
          role: clerkSession.role,
          skills: ["React", "TypeScript", "Node.js", "Next.js", "CognoDB"],
          projects: ["CareerGraph SaaS"],
        }),
      }).catch(() => {});
    }

    setAvailableUsers(allUsers);
  }, [isLoaded, isSignedIn, clerkUser]);

  const switchUser = (userId: string) => {
    const match = availableUsers.find((u) => u.id === userId);
    if (match) {
      setUser(match);
      localStorage.setItem("careergraph_user_id", match.id);
    }
  };

  const logout = () => {
    if (isSignedIn) {
      signOut();
    }
    setUser({
      id: `person:guest-${Date.now()}`,
      name: "Guest User",
      email: "guest@example.com",
      title: "Software Engineer",
      role: "USER",
      hasCompletedOnboarding: false,
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchUser, availableUsers, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
