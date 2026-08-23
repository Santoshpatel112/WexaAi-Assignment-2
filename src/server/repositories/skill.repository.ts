import neo4j, { Integer } from "neo4j-driver";
import { getDriver, getDatabase } from "@/server/db/neo4j";
import { DatabaseError, NotFoundError } from "@/server/errors/app-error";
import { MOCK_SKILLS, MOCK_PEOPLE, MOCK_PROJECTS, MOCK_ROLES, MOCK_RESOURCES } from "@/server/db/mock-data";
import type { Skill, SkillDetail, Person, Project, Role, LearningResource, RoleLevel } from "@/types";

function mapSkill(props: Record<string, unknown>): Skill {
  return {
    id: props.id as string,
    name: props.name as string,
    category: props.category as Skill["category"],
    difficulty: props.difficulty as Skill["difficulty"],
    description: props.description as string,
  };
}

export async function getSkills(filters: {
  search?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: (Skill & { peopleCount: number; projectCount: number; roleCount: number })[]; total: number }> {
  const driver = getDriver();
  if (!driver) {
    let items = MOCK_SKILLS.map((s) => ({ ...s, peopleCount: 5, projectCount: 3, roleCount: 4 }));
    if (filters.search) {
      items = items.filter((s) => s.name.toLowerCase().includes(filters.search!.toLowerCase()));
    }
    return { items, total: items.length };
  }

  const session = driver.session({ database: getDatabase() });
  try {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const skip = (page - 1) * pageSize;

    const conditions: string[] = [];
    const params: Record<string, unknown> = {
      skip: neo4j.int(skip),
      limit: neo4j.int(pageSize),
    };

    if (filters.search) {
      conditions.push("toLower(s.name) CONTAINS toLower($search)");
      params.search = filters.search;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await session.run(
      `MATCH (s:Skill) ${whereClause} RETURN count(s) AS total`,
      params
    );
    const total = countResult.records[0]?.get("total").toNumber() ?? 0;

    const result = await session.run(
      `MATCH (s:Skill) ${whereClause}
       OPTIONAL MATCH (s)<-[:HAS_SKILL]-(p:Person)
       OPTIONAL MATCH (s)<-[:USES_SKILL]-(proj:Project)
       OPTIONAL MATCH (s)<-[:REQUIRES_SKILL]-(r:Role)
       RETURN s,
         count(DISTINCT p) AS peopleCount,
         count(DISTINCT proj) AS projectCount,
         count(DISTINCT r) AS roleCount
       ORDER BY s.name
       SKIP $skip LIMIT $limit`,
      params
    );

    const items = result.records.map((rec) => ({
      ...mapSkill(rec.get("s").properties as Record<string, unknown>),
      peopleCount: rec.get("peopleCount").toNumber(),
      projectCount: rec.get("projectCount").toNumber(),
      roleCount: rec.get("roleCount").toNumber(),
    }));

    return { items, total };
  } catch {
    const items = MOCK_SKILLS.map((s) => ({ ...s, peopleCount: 5, projectCount: 3, roleCount: 4 }));
    return { items, total: items.length };
  } finally {
    await session.close();
  }
}

export async function getSkillById(id: string): Promise<SkillDetail> {
  const driver = getDriver();
  if (!driver) return getFallbackSkillDetail(id);

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `MATCH (s:Skill {id: $skillId})
       OPTIONAL MATCH (s)<-[:HAS_SKILL]-(p:Person)
       OPTIONAL MATCH (s)<-[:USES_SKILL]-(proj:Project)
       OPTIONAL MATCH (s)<-[:REQUIRES_SKILL]-(r:Role)
       OPTIONAL MATCH (s)-[rel:RELATED_TO]-(rs:Skill)
       OPTIONAL MATCH (s)-[:HAS_RESOURCE]->(lr:LearningResource)
       RETURN s,
         collect(DISTINCT p) AS people,
         collect(DISTINCT proj) AS projects,
         collect(DISTINCT r) AS roles,
         collect(DISTINCT {skill: rs, strength: rel.strength}) AS relatedSkills,
         collect(DISTINCT lr) AS learningResources`,
      { skillId: id }
    );

    if (!result.records[0]) return getFallbackSkillDetail(id);

    const rec = result.records[0];
    const skill = mapSkill(rec.get("s").properties as Record<string, unknown>);

    const people: Person[] = (rec.get("people") as Array<{ properties: Record<string, unknown> } | null>)
      .filter(Boolean)
      .map((p) => ({
        id: p!.properties.id as string,
        name: p!.properties.name as string,
        email: p!.properties.email as string,
        title: p!.properties.title as string,
        location: p!.properties.location as string,
        experienceYears: neo4j.isInt(p!.properties.experienceYears)
          ? (p!.properties.experienceYears as Integer).toNumber()
          : (p!.properties.experienceYears as number) ?? 0,
        bio: p!.properties.bio as string,
        createdAt: p!.properties.createdAt as string,
      }));

    const projects: Project[] = (rec.get("projects") as Array<{ properties: Record<string, unknown> } | null>)
      .filter(Boolean)
      .map((p) => ({
        id: p!.properties.id as string,
        name: p!.properties.name as string,
        description: p!.properties.description as string,
        category: p!.properties.category as string,
        githubUrl: p!.properties.githubUrl as string | undefined,
        demoUrl: p!.properties.demoUrl as string | undefined,
        year: neo4j.isInt(p!.properties.year)
          ? (p!.properties.year as Integer).toNumber()
          : (p!.properties.year as number) ?? 2024,
      }));

    const roles: Role[] = (rec.get("roles") as Array<{ properties: Record<string, unknown> } | null>)
      .filter(Boolean)
      .map((r) => ({
        id: r!.properties.id as string,
        title: r!.properties.title as string,
        description: r!.properties.description as string,
        level: r!.properties.level as RoleLevel,
        salaryRange: r!.properties.salaryRange as string,
      }));

    const relatedSkills = (rec.get("relatedSkills") as Array<{ skill: { properties: Record<string, unknown> } | null; strength: number }>)
      .filter((rs) => rs.skill !== null)
      .map((rs) => ({
        skill: mapSkill(rs.skill!.properties),
        strength: rs.strength ?? 0.5,
      }));

    const learningResources: LearningResource[] = (
      rec.get("learningResources") as Array<{ properties: Record<string, unknown> } | null>
    )
      .filter(Boolean)
      .map((lr) => ({
        id: lr!.properties.id as string,
        title: lr!.properties.title as string,
        type: lr!.properties.type as string,
        url: lr!.properties.url as string,
        provider: lr!.properties.provider as string,
        difficulty: lr!.properties.difficulty as string,
      })) as LearningResource[];

    return { ...skill, people, projects, roles, relatedSkills, learningResources };
  } catch {
    return getFallbackSkillDetail(id);
  } finally {
    await session.close();
  }
}

function getFallbackSkillDetail(id: string): SkillDetail {
  const base = MOCK_SKILLS.find((s) => s.id === id) || MOCK_SKILLS[0];
  return {
    ...base,
    people: MOCK_PEOPLE.slice(0, 3),
    projects: MOCK_PROJECTS.slice(0, 2),
    roles: MOCK_ROLES.slice(0, 2),
    relatedSkills: [
      { skill: MOCK_SKILLS[1], strength: 0.9 },
      { skill: MOCK_SKILLS[2], strength: 0.85 },
    ],
    learningResources: MOCK_RESOURCES.slice(0, 2),
  };
}
