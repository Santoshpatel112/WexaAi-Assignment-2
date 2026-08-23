import neo4j, { Integer } from "neo4j-driver";
import { getDriver, getDatabase } from "@/server/db/neo4j";
import { DatabaseError, NotFoundError } from "@/server/errors/app-error";
import { MOCK_ROLES, MOCK_SKILLS, MOCK_COMPANIES } from "@/server/db/mock-data";
import type { Role, RoleDetail, Company, Skill, RoleLevel } from "@/types";

function mapRole(props: Record<string, unknown>): Role {
  return {
    id: props.id as string,
    title: props.title as string,
    description: props.description as string,
    level: props.level as RoleLevel,
    salaryRange: props.salaryRange as string,
  };
}

export async function getRoles(filters: {
  search?: string;
  level?: string;
  company?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: (Role & { companyCount: number; skillCount: number })[]; total: number }> {
  const driver = getDriver();
  if (!driver) {
    let items = MOCK_ROLES.map((r) => ({ ...r, companyCount: 2, skillCount: 4 }));
    if (filters.search) {
      items = items.filter((r) => r.title.toLowerCase().includes(filters.search!.toLowerCase()));
    }
    return { items, total: items.length };
  }

  const session = driver.session({ database: getDatabase() });
  try {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const skip = (page - 1) * pageSize;

    const params: Record<string, unknown> = {
      skip: neo4j.int(skip),
      limit: neo4j.int(pageSize),
    };

    const conditions: string[] = [];
    if (filters.search) {
      conditions.push("toLower(r.title) CONTAINS toLower($search)");
      params.search = filters.search;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await session.run(
      `MATCH (r:Role) ${whereClause} RETURN count(r) AS total`,
      params
    );
    const total = countResult.records[0]?.get("total").toNumber() ?? 0;

    const result = await session.run(
      `MATCH (r:Role) ${whereClause}
       OPTIONAL MATCH (r)-[:OFFERED_BY]->(c:Company)
       OPTIONAL MATCH (r)-[:REQUIRES_SKILL]->(s:Skill)
       RETURN r,
         count(DISTINCT c) AS companyCount,
         count(DISTINCT s) AS skillCount
       ORDER BY r.title
       SKIP $skip LIMIT $limit`,
      params
    );

    return {
      items: result.records.map((rec) => ({
        ...mapRole(rec.get("r").properties as Record<string, unknown>),
        companyCount: rec.get("companyCount").toNumber(),
        skillCount: rec.get("skillCount").toNumber(),
      })),
      total,
    };
  } catch {
    const items = MOCK_ROLES.map((r) => ({ ...r, companyCount: 2, skillCount: 4 }));
    return { items, total: items.length };
  } finally {
    await session.close();
  }
}

export async function getRoleById(id: string): Promise<RoleDetail> {
  const driver = getDriver();
  if (!driver) return getFallbackRoleDetail(id);

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `MATCH (r:Role {id: $roleId})
       OPTIONAL MATCH (r)-[rs:REQUIRES_SKILL]->(s:Skill)
       OPTIONAL MATCH (r)-[:OFFERED_BY]->(c:Company)
       RETURN r,
         collect(DISTINCT {skill: s, importance: rs.importance, minimumLevel: rs.minimumLevel}) AS requiredSkills,
         collect(DISTINCT c) AS companies`,
      { roleId: id }
    );

    if (!result.records[0]) return getFallbackRoleDetail(id);

    const rec = result.records[0];
    const role = mapRole(rec.get("r").properties as Record<string, unknown>);

    const requiredSkills = (
      rec.get("requiredSkills") as Array<{
        skill: { properties: Record<string, unknown> } | null;
        importance: string;
        minimumLevel: string;
      }>
    )
      .filter((rs) => rs.skill !== null)
      .map((rs) => ({
        skill: {
          id: rs.skill!.properties.id as string,
          name: rs.skill!.properties.name as string,
          category: rs.skill!.properties.category as string,
          difficulty: rs.skill!.properties.difficulty as string,
          description: rs.skill!.properties.description as string,
        } as Skill,
        importance: (rs.importance ?? "medium") as import("@/types").Importance,
        minimumLevel: (rs.minimumLevel ?? "intermediate") as import("@/types").SkillLevel,
      }));

    const companies: Company[] = (
      rec.get("companies") as Array<{ properties: Record<string, unknown> } | null>
    )
      .filter(Boolean)
      .map((c) => ({
        id: c!.properties.id as string,
        name: c!.properties.name as string,
        industry: c!.properties.industry as string,
        location: c!.properties.location as string,
        website: c!.properties.website as string | undefined,
        logo: c!.properties.logo as string | undefined,
      }));

    return { ...role, requiredSkills, companies };
  } catch {
    return getFallbackRoleDetail(id);
  } finally {
    await session.close();
  }
}

function getFallbackRoleDetail(id: string): RoleDetail {
  const base = MOCK_ROLES.find((r) => r.id === id) || MOCK_ROLES[0];
  return {
    ...base,
    requiredSkills: [
      { skill: MOCK_SKILLS[2], importance: "critical", minimumLevel: "intermediate" },
      { skill: MOCK_SKILLS[3], importance: "critical", minimumLevel: "intermediate" },
      { skill: MOCK_SKILLS[6], importance: "high", minimumLevel: "intermediate" },
      { skill: MOCK_SKILLS[12], importance: "medium", minimumLevel: "beginner" },
    ],
    companies: MOCK_COMPANIES.slice(0, 2),
  };
}
