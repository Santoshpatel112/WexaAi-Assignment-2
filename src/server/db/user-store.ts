import neo4j from "neo4j-driver";
import { getDriver, getDatabase } from "@/server/db/neo4j";
import { MOCK_PEOPLE, MOCK_SKILLS, MOCK_ROLES, MOCK_COMPANIES, MOCK_PROJECTS, MOCK_RESOURCES } from "@/server/db/mock-data";
import type { OnboardingPayload, PersonDetail, Skill, Project, Role, Company, LearningResource, RoleLevel, SkillCategory, SkillLevel } from "@/types";

// In-memory store for newly onboarded custom users when offline
const DYNAMIC_USERS = new Map<string, OnboardingPayload>();
const SAVED_JOBS = new Map<string, Set<string>>(); // userId -> Set of jobIds
const APPLICATIONS = new Map<string, Map<string, { status: string; appliedAt: string }>>();

export async function saveOnboardingData(payload: OnboardingPayload): Promise<boolean> {
  // Store locally for zero-latency fallback
  DYNAMIC_USERS.set(payload.userId, payload);

  const driver = getDriver();
  if (!driver) return true;

  const session = driver.session({ database: getDatabase() });
  try {
    // 1. Create or update User node
    await session.run(
      `MERGE (u:Person {id: $userId})
       SET u.name = $name,
           u.title = $title,
           u.experienceYears = $experienceYears,
           u.location = $location,
           u.bio = $bio,
           u.createdAt = date()`,
      {
        userId: payload.userId,
        name: payload.name,
        title: payload.title,
        experienceYears: neo4j.int(parseInt(String(payload.experienceYears ?? 0), 10)),
        location: payload.location,
        bio: payload.bio,
      }
    );

    // 2. Connect Skills (:User)-[:HAS_SKILL]->(:Skill)
    for (const skillItem of payload.skills) {
      const skillId = `skill:${skillItem.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      await session.run(
        `MERGE (s:Skill {id: $skillId})
         ON CREATE SET s.name = $skillName, s.category = $category, s.difficulty = 'Intermediate'
         WITH s
         MATCH (u:Person {id: $userId})
         MERGE (u)-[r:HAS_SKILL]->(s)
         SET r.level = $level, r.years = $years`,
        {
          userId: payload.userId,
          skillId,
          skillName: skillItem.name,
          category: skillItem.category,
          level: skillItem.level,
          years: neo4j.int(parseInt(String(skillItem.years ?? 0), 10)),
        }
      );
    }

    // 3. Connect Projects (:User)-[:WORKED_ON]->(:Project)-[:USES_SKILL]->(:Skill)
    for (const proj of payload.projects) {
      const projId = `proj:${proj.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      await session.run(
        `MERGE (p:Project {id: $projId})
         SET p.name = $name, p.description = $desc, p.githubUrl = $gh, p.demoUrl = $demo, p.year = 2024
         WITH p
         MATCH (u:Person {id: $userId})
         MERGE (u)-[r:WORKED_ON]->(p)
         SET r.role = $role, r.duration = 'Recent'`,
        {
          userId: payload.userId,
          projId,
          name: proj.name,
          desc: proj.description,
          gh: proj.githubUrl ?? "",
          demo: proj.demoUrl ?? "",
          role: proj.role,
        }
      );

      for (const techName of proj.technologies) {
        const techId = `skill:${techName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        await session.run(
          `MATCH (p:Project {id: $projId})
           MERGE (s:Skill {id: $techId})
           ON CREATE SET s.name = $techName, s.category = 'Technology', s.difficulty = 'Intermediate'
           MERGE (p)-[:USES_SKILL]->(s)`,
          { projId, techId, techName }
        );
      }
    }

    // 4. Connect Target Role (:User)-[:TARGETS]->(:Role)
    if (payload.preferences.targetRoleId) {
      await session.run(
        `MATCH (u:Person {id: $userId})
         MATCH (r:Role {id: $targetRoleId})
         MERGE (u)-[:TARGETS]->(r)`,
        { userId: payload.userId, targetRoleId: payload.preferences.targetRoleId }
      );
    }

    return true;
  } catch (err) {
    console.error("Failed to save onboarding graph data:", err);
    return true; // gracefully degrade
  } finally {
    await session.close();
  }
}

export function getCustomUserData(userId: string): OnboardingPayload | undefined {
  return DYNAMIC_USERS.get(userId);
}

// ============================================
// Saved Jobs
// ============================================

export function toggleSaveJob(userId: string, jobId: string): boolean {
  if (!SAVED_JOBS.has(userId)) {
    SAVED_JOBS.set(userId, new Set());
  }
  const set = SAVED_JOBS.get(userId)!;
  if (set.has(jobId)) {
    set.delete(jobId);
    return false;
  } else {
    set.add(jobId);
    return true;
  }
}

export function getSavedJobs(userId: string): string[] {
  return [...(SAVED_JOBS.get(userId) || [])];
}

// ============================================
// Job Applications
// ============================================

export function applyToJob(userId: string, jobId: string): boolean {
  if (!APPLICATIONS.has(userId)) {
    APPLICATIONS.set(userId, new Map());
  }
  const map = APPLICATIONS.get(userId)!;
  map.set(jobId, { status: "applied", appliedAt: new Date().toISOString() });
  return true;
}

export function getUserApplications(userId: string): Record<string, { status: string; appliedAt: string }> {
  const map = APPLICATIONS.get(userId);
  if (!map) return {};
  return Object.fromEntries(map.entries());
}
