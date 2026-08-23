import neo4j, { Integer } from "neo4j-driver";
import { getDriver, getDatabase } from "@/server/db/neo4j";
import { DatabaseError, NotFoundError } from "@/server/errors/app-error";
import { MOCK_PEOPLE } from "@/server/db/mock-data";
import type {
  Person,
  PersonDetail,
  PersonSkill,
  PersonProject,
  Role,
} from "@/types";

function mapPerson(props: Record<string, unknown>): Person {
  return {
    id: props.id as string,
    name: props.name as string,
    email: props.email as string,
    title: props.title as string,
    location: props.location as string,
    experienceYears: neo4j.isInt(props.experienceYears)
      ? (props.experienceYears as Integer).toNumber()
      : (props.experienceYears as number) ?? 0,
    bio: props.bio as string,
    avatar: props.avatar as string | undefined,
    createdAt: props.createdAt as string,
  };
}

export async function getPeople(filters: {
  search?: string;
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ items: Person[]; total: number }> {
  const driver = getDriver();
  if (!driver) {
    let items = MOCK_PEOPLE;
    if (filters.search) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          p.title.toLowerCase().includes(filters.search!.toLowerCase())
      );
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
      conditions.push("(toLower(p.name) CONTAINS toLower($search) OR toLower(p.title) CONTAINS toLower($search))");
      params.search = filters.search;
    }
    if (filters.location) {
      conditions.push("toLower(p.location) CONTAINS toLower($location)");
      params.location = filters.location;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await session.run(
      `MATCH (p:Person) ${whereClause} RETURN count(p) AS total`,
      params
    );
    const total = countResult.records[0]?.get("total").toNumber() ?? 0;

    const result = await session.run(
      `MATCH (p:Person) ${whereClause}
       RETURN p
       ORDER BY p.name
       SKIP $skip LIMIT $limit`,
      params
    );

    const items = result.records.map((r) =>
      mapPerson(r.get("p").properties as Record<string, unknown>)
    );

    return { items, total };
  } catch {
    return { items: MOCK_PEOPLE, total: MOCK_PEOPLE.length };
  } finally {
    await session.close();
  }
}

export async function getPersonById(id: string): Promise<PersonDetail> {
  const driver = getDriver();
  if (!driver) {
    return getFallbackPersonDetail(id);
  }

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `MATCH (p:Person {id: $personId})
       OPTIONAL MATCH (p)-[hs:HAS_SKILL]->(s:Skill)
       OPTIONAL MATCH (p)-[wo:WORKED_ON]->(proj:Project)
       OPTIONAL MATCH (p)-[:TARGETS]->(tr:Role)
       RETURN p,
         collect(DISTINCT {skill: s, level: hs.level, years: hs.years}) AS skills,
         collect(DISTINCT {project: proj, role: wo.role, duration: wo.duration}) AS projects,
         collect(DISTINCT tr) AS targetRoles`,
      { personId: id }
    );

    if (!result.records[0]) return getFallbackPersonDetail(id);

    const record = result.records[0];
    const person = mapPerson(record.get("p").properties as Record<string, unknown>);

    const skills: PersonSkill[] = (
      record.get("skills") as Array<{ skill: { properties: Record<string, unknown> } | null; level: string; years: unknown }>
    )
      .filter((s) => s.skill !== null)
      .map((s) => ({
        skill: {
          id: s.skill!.properties.id as string,
          name: s.skill!.properties.name as string,
          category: s.skill!.properties.category as string,
          difficulty: s.skill!.properties.difficulty as string,
          description: s.skill!.properties.description as string,
        } as import("@/types").Skill,
        level: (s.level ?? "beginner") as import("@/types").SkillLevel,
        years: neo4j.isInt(s.years) ? (s.years as Integer).toNumber() : (s.years as number) ?? 0,
      }));

    const projects: PersonProject[] = (
      record.get("projects") as Array<{ project: { properties: Record<string, unknown> } | null; role: string; duration: string }>
    )
      .filter((p) => p.project !== null)
      .map((p) => ({
        project: {
          id: p.project!.properties.id as string,
          name: p.project!.properties.name as string,
          description: p.project!.properties.description as string,
          category: p.project!.properties.category as string,
          githubUrl: p.project!.properties.githubUrl as string | undefined,
          demoUrl: p.project!.properties.demoUrl as string | undefined,
          year: neo4j.isInt(p.project!.properties.year)
            ? (p.project!.properties.year as Integer).toNumber()
            : (p.project!.properties.year as number) ?? 2024,
        } as import("@/types").Project,
        role: p.role ?? "Contributor",
        duration: p.duration ?? "",
      }));

    const targetRoles = (record.get("targetRoles") as Array<{ properties: Record<string, unknown> } | null>)
      .filter(Boolean)
      .map((r) => ({
        id: r!.properties.id as string,
        title: r!.properties.title as string,
        description: r!.properties.description as string,
        level: r!.properties.level as import("@/types").RoleLevel,
        salaryRange: r!.properties.salaryRange as string,
      })) as Role[];

    return { ...person, skills, projects, targetRoles };
  } catch {
    return getFallbackPersonDetail(id);
  } finally {
    await session.close();
  }
}

function getFallbackPersonDetail(id: string): PersonDetail {
  const base = MOCK_PEOPLE.find((p) => p.id === id) || MOCK_PEOPLE[0];
  return {
    ...base,
    skills: [
      { skill: { id: "skill:react", name: "React", category: "Frontend", difficulty: "Intermediate", description: "" }, level: "advanced", years: 3 },
      { skill: { id: "skill:nextjs", name: "Next.js", category: "Frontend", difficulty: "Advanced", description: "" }, level: "advanced", years: 2 },
      { skill: { id: "skill:typescript", name: "TypeScript", category: "Frontend", difficulty: "Intermediate", description: "" }, level: "advanced", years: 3 },
      { skill: { id: "skill:nodejs", name: "Node.js", category: "Backend", difficulty: "Intermediate", description: "" }, level: "intermediate", years: 3 },
      { skill: { id: "skill:neo4j", name: "Neo4j / CognoDB", category: "Database", difficulty: "Advanced", description: "" }, level: "intermediate", years: 2 },
    ],
    projects: [
      { project: { id: "proj:careergraph", name: "CareerGraph", description: "Interactive career & skill knowledge graph SaaS", category: "SaaS", year: 2024 }, role: "Full Stack Developer", duration: "3 months" },
    ],
    targetRoles: [
      { id: "role:senior-fullstack", title: "Senior Full Stack Engineer", description: "", level: "Senior", salaryRange: "$160K-$210K" }
    ],
  };
}
