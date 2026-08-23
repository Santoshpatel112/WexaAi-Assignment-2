import neo4j, { Integer } from "neo4j-driver";
import { getDriver, getDatabase } from "@/server/db/neo4j";
import { MOCK_ROLES, MOCK_SKILLS, MOCK_COMPANIES, MOCK_PEOPLE, MOCK_RESOURCES } from "@/server/db/mock-data";
import type {
  CareerPath, RoleMatch, SkillGap, LearningStep,
  Skill, Company, LearningResource, Person, Role, RoleLevel
} from "@/types";

export async function getRoleMatches(personId: string): Promise<RoleMatch[]> {
  const driver = getDriver();
  if (!driver) return getFallbackRoleMatches();

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(ps:Skill)
       WITH p, collect(DISTINCT ps.id) AS personSkillIds
       MATCH (r:Role)-[rs:REQUIRES_SKILL]->(req:Skill)
       WITH p, personSkillIds, r,
            collect(DISTINCT req) AS requiredSkills
       WITH p, r, requiredSkills,
            [s IN requiredSkills WHERE s.id IN personSkillIds] AS matchedSkills,
            [s IN requiredSkills WHERE NOT s.id IN personSkillIds] AS missingSkills
       WHERE size(requiredSkills) > 0
       OPTIONAL MATCH (r)-[:OFFERED_BY]->(c:Company)
       RETURN r,
         matchedSkills,
         missingSkills,
         collect(DISTINCT c) AS companies,
         round(100.0 * size(matchedSkills) / size(requiredSkills)) AS matchPct
       ORDER BY matchPct DESC
       LIMIT 10`,
      { personId }
    );

    return result.records.map((rec) => {
      const roleProps = rec.get("r").properties as Record<string, unknown>;
      const matchPct = rec.get("matchPct") as number;

      return {
        role: {
          id: roleProps.id as string,
          title: roleProps.title as string,
          description: roleProps.description as string,
          level: roleProps.level as RoleLevel,
          salaryRange: roleProps.salaryRange as string,
        } as Role,
        matchPercentage: Math.round(matchPct),
        matchedSkills: mapSkillList(rec.get("matchedSkills")),
        missingSkills: mapSkillList(rec.get("missingSkills")),
        companies: mapCompanyList(rec.get("companies")),
      };
    });
  } catch {
    return getFallbackRoleMatches();
  } finally {
    await session.close();
  }
}

export async function getCareerPath(
  personId: string,
  targetRoleId: string
): Promise<CareerPath> {
  const driver = getDriver();
  if (!driver) return getFallbackCareerPath(personId, targetRoleId);

  const session = driver.session({ database: getDatabase() });
  try {
    const personResult = await session.run(
      `MATCH (p:Person {id: $personId})
       OPTIONAL MATCH (p)-[:HAS_SKILL]->(ps:Skill)
       RETURN p, collect(DISTINCT ps) AS personSkills`,
      { personId }
    );

    if (!personResult.records[0]) return getFallbackCareerPath(personId, targetRoleId);

    const personRec = personResult.records[0];
    const personProps = personRec.get("p").properties as Record<string, unknown>;
    const person: Person = {
      id: personProps.id as string,
      name: personProps.name as string,
      email: personProps.email as string,
      title: personProps.title as string,
      location: personProps.location as string,
      experienceYears: neo4j.isInt(personProps.experienceYears)
        ? (personProps.experienceYears as Integer).toNumber()
        : (personProps.experienceYears as number) ?? 0,
      bio: personProps.bio as string,
      createdAt: personProps.createdAt as string,
    };

    const personSkills = mapSkillList(personRec.get("personSkills"));
    const personSkillIds = new Set(personSkills.map((s) => s.id));

    const roleResult = await session.run(
      `MATCH (r:Role {id: $roleId})
       OPTIONAL MATCH (r)-[rs:REQUIRES_SKILL]->(req:Skill)
       OPTIONAL MATCH (r)-[:OFFERED_BY]->(c:Company)
       RETURN r,
         collect(DISTINCT {skill: req, importance: rs.importance, minimumLevel: rs.minimumLevel}) AS requiredSkills,
         collect(DISTINCT c) AS companies`,
      { roleId: targetRoleId }
    );

    if (!roleResult.records[0]) return getFallbackCareerPath(personId, targetRoleId);

    const roleRec = roleResult.records[0];
    const roleProps = roleRec.get("r").properties as Record<string, unknown>;
    const targetRole: Role = {
      id: roleProps.id as string,
      title: roleProps.title as string,
      description: roleProps.description as string,
      level: roleProps.level as RoleLevel,
      salaryRange: roleProps.salaryRange as string,
    };

    const requiredSkillsRaw = (roleRec.get("requiredSkills") as Array<{
      skill: { properties: Record<string, unknown> } | null;
      importance: string;
      minimumLevel: string;
    }>).filter((r) => r.skill !== null);

    const matchedSkills = requiredSkillsRaw
      .filter((r) => personSkillIds.has(r.skill!.properties.id as string))
      .map((r) => mapSkillProps(r.skill!.properties));

    const missingSkillsRaw = requiredSkillsRaw.filter(
      (r) => !personSkillIds.has(r.skill!.properties.id as string)
    );

    const recommendedCompanies = mapCompanyList(roleRec.get("companies"));

    const skillGaps: SkillGap[] = await Promise.all(
      missingSkillsRaw.map(async (raw) => {
        const skillId = raw.skill!.properties.id as string;
        const gapResult = await session.run(
          `MATCH (target:Skill {id: $skillId})
           OPTIONAL MATCH (target)-[:HAS_RESOURCE]->(lr:LearningResource)
           OPTIONAL MATCH (owned:Skill)-[:RELATED_TO]-(target)
           WHERE owned.id IN $ownedSkillIds
           RETURN collect(DISTINCT lr) AS resources,
                  collect(DISTINCT owned) AS relatedOwned`,
          { skillId, ownedSkillIds: [...personSkillIds] }
        );

        const gapRec = gapResult.records[0];
        const resources = gapRec ? mapResourceList(gapRec.get("resources")) : [];
        const relatedOwnedSkills = gapRec ? mapSkillList(gapRec.get("relatedOwned")) : [];

        return {
          skill: mapSkillProps(raw.skill!.properties),
          importance: (raw.importance ?? "medium") as import("@/types").Importance,
          minimumLevel: (raw.minimumLevel ?? "intermediate") as import("@/types").SkillLevel,
          resources,
          relatedOwnedSkills,
        };
      })
    );

    const learningPath: LearningStep[] = skillGaps.map((gap) => ({
      skill: gap.skill,
      resources: gap.resources,
      relatedSkills: gap.relatedOwnedSkills,
    }));

    const matchPercentage =
      requiredSkillsRaw.length > 0
        ? Math.round((matchedSkills.length / requiredSkillsRaw.length) * 100)
        : 0;

    return {
      person,
      targetRole,
      matchPercentage,
      matchedSkills,
      skillGaps,
      learningPath,
      estimatedMonths: Math.max(skillGaps.length * 1.5, 1),
      recommendedCompanies,
    };
  } catch {
    return getFallbackCareerPath(personId, targetRoleId);
  } finally {
    await session.close();
  }
}

function mapSkillProps(props: Record<string, unknown>): Skill {
  return {
    id: props.id as string,
    name: props.name as string,
    category: props.category as Skill["category"],
    difficulty: props.difficulty as Skill["difficulty"],
    description: props.description as string,
  };
}

function mapSkillList(raw: unknown): Skill[] {
  return ((raw as Array<{ properties: Record<string, unknown> }>) ?? [])
    .filter(Boolean)
    .map((s) => mapSkillProps(s.properties));
}

function mapCompanyList(raw: unknown): Company[] {
  return ((raw as Array<{ properties: Record<string, unknown> }>) ?? [])
    .filter(Boolean)
    .map((c) => ({
      id: c.properties.id as string,
      name: c.properties.name as string,
      industry: c.properties.industry as string,
      location: c.properties.location as string,
      website: c.properties.website as string | undefined,
    }));
}

function mapResourceList(raw: unknown): LearningResource[] {
  return ((raw as Array<{ properties: Record<string, unknown> }>) ?? [])
    .filter(Boolean)
    .map((lr) => ({
      id: lr.properties.id as string,
      title: lr.properties.title as string,
      type: lr.properties.type as string,
      url: lr.properties.url as string,
      provider: lr.properties.provider as string,
      difficulty: lr.properties.difficulty as string,
    })) as LearningResource[];
}

function getFallbackRoleMatches(): RoleMatch[] {
  return [
    {
      role: MOCK_ROLES[0],
      matchPercentage: 92,
      matchedSkills: [MOCK_SKILLS[2], MOCK_SKILLS[3], MOCK_SKILLS[1], MOCK_SKILLS[6]],
      missingSkills: [MOCK_SKILLS[12]],
      companies: [MOCK_COMPANIES[0], MOCK_COMPANIES[1]],
    },
    {
      role: MOCK_ROLES[1],
      matchPercentage: 75,
      matchedSkills: [MOCK_SKILLS[2], MOCK_SKILLS[3], MOCK_SKILLS[1]],
      missingSkills: [MOCK_SKILLS[12], MOCK_SKILLS[14]],
      companies: [MOCK_COMPANIES[2]],
    },
  ];
}

function getFallbackCareerPath(personId: string, targetRoleId: string): CareerPath {
  const person = MOCK_PEOPLE.find((p) => p.id === personId) || MOCK_PEOPLE[0];
  const targetRole = MOCK_ROLES.find((r) => r.id === targetRoleId) || MOCK_ROLES[1];

  return {
    person,
    targetRole,
    matchPercentage: 75,
    matchedSkills: [MOCK_SKILLS[2], MOCK_SKILLS[3], MOCK_SKILLS[1]],
    skillGaps: [
      {
        skill: MOCK_SKILLS[12], // Docker
        importance: "high",
        minimumLevel: "intermediate",
        resources: [MOCK_RESOURCES[0]],
        relatedOwnedSkills: [MOCK_SKILLS[6]],
      },
      {
        skill: MOCK_SKILLS[14], // AWS
        importance: "high",
        minimumLevel: "intermediate",
        resources: [MOCK_RESOURCES[1]],
        relatedOwnedSkills: [],
      },
    ],
    learningPath: [
      { skill: MOCK_SKILLS[12], resources: [MOCK_RESOURCES[0]], relatedSkills: [MOCK_SKILLS[6]] },
      { skill: MOCK_SKILLS[14], resources: [MOCK_RESOURCES[1]], relatedSkills: [] },
    ],
    estimatedMonths: 3,
    recommendedCompanies: MOCK_COMPANIES.slice(0, 2),
  };
}
