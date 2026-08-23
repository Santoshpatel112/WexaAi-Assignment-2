import neo4j, { Integer } from "neo4j-driver";
import { getDriver, getDatabase } from "@/server/db/neo4j";
import { MOCK_STATS, MOCK_PEOPLE, MOCK_SKILLS, MOCK_ROLES, MOCK_COMPANIES, MOCK_PROJECTS } from "@/server/db/mock-data";
import type {
  GraphData, GraphNode, GraphEdge, GraphStats,
  Person, Skill, Project, Role, Company, RoleLevel,
} from "@/types";

export async function getGraphStats(): Promise<GraphStats> {
  const driver = getDriver();
  if (!driver) return MOCK_STATS;

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(`
      MATCH (p:Person) WITH count(p) AS people
      MATCH (s:Skill) WITH people, count(s) AS skills
      MATCH (proj:Project) WITH people, skills, count(proj) AS projects
      MATCH (r:Role) WITH people, skills, projects, count(r) AS roles
      MATCH (c:Company) WITH people, skills, projects, roles, count(c) AS companies
      MATCH (lr:LearningResource) WITH people, skills, projects, roles, companies, count(lr) AS learningResources
      MATCH ()-[rel]->() WITH people, skills, projects, roles, companies, learningResources, count(rel) AS relationships
      RETURN people, skills, projects, roles, companies, learningResources, relationships
    `);
    const rec = result.records[0];
    if (!rec) return MOCK_STATS;
    return {
      people: rec.get("people").toNumber(),
      skills: rec.get("skills").toNumber(),
      projects: rec.get("projects").toNumber(),
      roles: rec.get("roles").toNumber(),
      companies: rec.get("companies").toNumber(),
      learningResources: rec.get("learningResources").toNumber(),
      relationships: rec.get("relationships").toNumber(),
    };
  } catch {
    return MOCK_STATS;
  } finally {
    await session.close();
  }
}

export async function getInitialGraph(limit = 30): Promise<GraphData> {
  const driver = getDriver();
  if (!driver) return getFallbackGraph();

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `MATCH (p:Person) WITH p LIMIT $personLimit
       OPTIONAL MATCH (p)-[r1:HAS_SKILL]->(s:Skill)
       OPTIONAL MATCH (p)-[r2:WORKED_ON]->(proj:Project)
       RETURN p, r1, s, r2, proj`,
      { personLimit: neo4j.int(Math.min(limit, 8)) }
    );

    const nodes = new Map<string, GraphNode>();
    const edges = new Map<string, GraphEdge>();

    for (const rec of result.records) {
      const person = rec.get("p");
      const skill = rec.get("s");
      const project = rec.get("proj");
      const r1 = rec.get("r1");
      const r2 = rec.get("r2");

      if (person) addNode(nodes, person, "Person");
      if (skill) addNode(nodes, skill, "Skill");
      if (project) addNode(nodes, project, "Project");
      if (r1 && person && skill) addEdge(edges, r1, person.properties.id as string, skill.properties.id as string);
      if (r2 && person && project) addEdge(edges, r2, person.properties.id as string, project.properties.id as string);
    }

    return { nodes: [...nodes.values()], edges: [...edges.values()] };
  } catch {
    return getFallbackGraph();
  } finally {
    await session.close();
  }
}

export async function expandNode(
  nodeId: string,
  nodeType: string,
  depth = 1
): Promise<GraphData> {
  const driver = getDriver();
  if (!driver) return getFallbackGraph();

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `MATCH (n {id: $nodeId})
       MATCH (n)-[r]-(neighbor)
       WHERE neighbor IS NOT NULL
       RETURN n, r, neighbor
       LIMIT $limit`,
      { nodeId, limit: neo4j.int(30) }
    );

    const nodes = new Map<string, GraphNode>();
    const edges = new Map<string, GraphEdge>();

    for (const rec of result.records) {
      const center = rec.get("n");
      const neighbor = rec.get("neighbor");
      const rel = rec.get("r");

      if (center) addNode(nodes, center, nodeType);
      if (neighbor) {
        const labels = neighbor.labels as string[];
        const type = labels[0] ?? "Unknown";
        addNode(nodes, neighbor, type);
      }
      if (rel && center && neighbor) {
        const startId = rel.startNodeElementId === center.elementId
          ? center.properties.id as string
          : neighbor.properties.id as string;
        const endId = rel.startNodeElementId === center.elementId
          ? neighbor.properties.id as string
          : center.properties.id as string;
        addEdge(edges, rel, startId, endId);
      }
    }

    return { nodes: [...nodes.values()], edges: [...edges.values()] };
  } catch {
    return getFallbackGraph();
  } finally {
    await session.close();
  }
}

export async function searchGraph(query: string, limit = 20): Promise<{
  people: Person[];
  skills: Skill[];
  roles: Role[];
  companies: Company[];
  projects: Project[];
  total: number;
}> {
  const driver = getDriver();
  if (!driver) {
    const people = MOCK_PEOPLE.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    const skills = MOCK_SKILLS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
    const roles = MOCK_ROLES.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
    const companies = MOCK_COMPANIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    const projects = MOCK_PROJECTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    return { people, skills, roles, companies, projects, total: people.length + skills.length + roles.length + companies.length + projects.length };
  }

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `OPTIONAL MATCH (p:Person) WHERE toLower(p.name) CONTAINS toLower($q) OR toLower(p.title) CONTAINS toLower($q)
       WITH collect(p)[..5] AS people
       OPTIONAL MATCH (s:Skill) WHERE toLower(s.name) CONTAINS toLower($q) OR toLower(s.category) CONTAINS toLower($q)
       WITH people, collect(s)[..5] AS skills
       OPTIONAL MATCH (r:Role) WHERE toLower(r.title) CONTAINS toLower($q)
       WITH people, skills, collect(r)[..5] AS roles
       OPTIONAL MATCH (c:Company) WHERE toLower(c.name) CONTAINS toLower($q)
       WITH people, skills, roles, collect(c)[..5] AS companies
       OPTIONAL MATCH (proj:Project) WHERE toLower(proj.name) CONTAINS toLower($q)
       WITH people, skills, roles, companies, collect(proj)[..5] AS projects
       RETURN people, skills, roles, companies, projects`,
      { q: query }
    );

    if (!result.records[0]) {
      return { people: [], skills: [], roles: [], companies: [], projects: [], total: 0 };
    }

    const rec = result.records[0];

    const people = ((rec.get("people") as Array<{ properties: Record<string, unknown> }>) ?? []).map((p) => ({
      id: p.properties.id as string,
      name: p.properties.name as string,
      email: p.properties.email as string,
      title: p.properties.title as string,
      location: p.properties.location as string,
      experienceYears: neo4j.isInt(p.properties.experienceYears)
        ? (p.properties.experienceYears as Integer).toNumber()
        : (p.properties.experienceYears as number) ?? 0,
      bio: p.properties.bio as string,
      createdAt: p.properties.createdAt as string,
    })) as Person[];

    const skills = ((rec.get("skills") as Array<{ properties: Record<string, unknown> }>) ?? []).map((s) => ({
      id: s.properties.id as string,
      name: s.properties.name as string,
      category: s.properties.category as string,
      difficulty: s.properties.difficulty as string,
      description: s.properties.description as string,
    })) as Skill[];

    const roles = ((rec.get("roles") as Array<{ properties: Record<string, unknown> }>) ?? []).map((r) => ({
      id: r.properties.id as string,
      title: r.properties.title as string,
      description: r.properties.description as string,
      level: r.properties.level as RoleLevel,
      salaryRange: r.properties.salaryRange as string,
    })) as Role[];

    const companies = ((rec.get("companies") as Array<{ properties: Record<string, unknown> }>) ?? []).map((c) => ({
      id: c.properties.id as string,
      name: c.properties.name as string,
      industry: c.properties.industry as string,
      location: c.properties.location as string,
      website: c.properties.website as string | undefined,
    })) as Company[];

    const projects = ((rec.get("projects") as Array<{ properties: Record<string, unknown> }>) ?? []).map((p) => ({
      id: p.properties.id as string,
      name: p.properties.name as string,
      description: p.properties.description as string,
      category: p.properties.category as string,
      year: neo4j.isInt(p.properties.year)
        ? (p.properties.year as Integer).toNumber()
        : (p.properties.year as number) ?? 2024,
    })) as Project[];

    const total = people.length + skills.length + roles.length + companies.length + projects.length;
    return { people, skills, roles, companies, projects, total };
  } catch {
    return { people: MOCK_PEOPLE, skills: MOCK_SKILLS, roles: MOCK_ROLES, companies: MOCK_COMPANIES, projects: MOCK_PROJECTS, total: 50 };
  } finally {
    await session.close();
  }
}

function addNode(
  map: Map<string, GraphNode>,
  node: { properties: Record<string, unknown>; labels?: string[] },
  type: string
) {
  const id = node.properties.id as string;
  if (!id || map.has(id)) return;
  map.set(id, {
    id,
    type: type as import("@/types").GraphNodeType,
    label: (node.properties.name ?? node.properties.title ?? id) as string,
    properties: node.properties,
  });
}

function addEdge(
  map: Map<string, GraphEdge>,
  rel: { type: string; properties: Record<string, unknown>; elementId: string },
  sourceId: string,
  targetId: string
) {
  const edgeId = rel.elementId ?? `${sourceId}-${rel.type}-${targetId}`;
  if (map.has(edgeId)) return;
  map.set(edgeId, {
    id: edgeId,
    source: sourceId,
    target: targetId,
    type: rel.type as import("@/types").RelationshipType,
    properties: rel.properties,
  });
}

function getFallbackGraph(): GraphData {
  return {
    nodes: [
      { id: "person:santosh-patel", type: "Person", label: "Santosh Patel", properties: { title: "Full Stack Engineer", experienceYears: 4 } },
      { id: "skill:react", type: "Skill", label: "React", properties: { category: "Frontend" } },
      { id: "skill:nextjs", type: "Skill", label: "Next.js", properties: { category: "Frontend" } },
      { id: "skill:typescript", type: "Skill", label: "TypeScript", properties: { category: "Frontend" } },
      { id: "skill:nodejs", type: "Skill", label: "Node.js", properties: { category: "Backend" } },
      { id: "skill:neo4j", type: "Skill", label: "Neo4j / CognoDB", properties: { category: "Database" } },
      { id: "proj:careergraph", type: "Project", label: "CareerGraph", properties: { category: "SaaS" } },
      { id: "role:fullstack-engineer", type: "Role", label: "Full Stack Engineer", properties: { salaryRange: "$130K-$175K", level: "Mid" } },
      { id: "company:wexa-ai", type: "Company", label: "Wexa AI", properties: { industry: "Artificial Intelligence" } },
    ],
    edges: [
      { id: "e1", source: "person:santosh-patel", target: "skill:react", type: "HAS_SKILL", properties: {} },
      { id: "e2", source: "person:santosh-patel", target: "skill:nextjs", type: "HAS_SKILL", properties: {} },
      { id: "e3", source: "person:santosh-patel", target: "skill:typescript", type: "HAS_SKILL", properties: {} },
      { id: "e4", source: "person:santosh-patel", target: "skill:neo4j", type: "HAS_SKILL", properties: {} },
      { id: "e5", source: "person:santosh-patel", target: "proj:careergraph", type: "WORKED_ON", properties: {} },
      { id: "e6", source: "proj:careergraph", target: "skill:neo4j", type: "USES_SKILL", properties: {} },
      { id: "e7", source: "role:fullstack-engineer", target: "skill:react", type: "REQUIRES_SKILL", properties: {} },
      { id: "e8", source: "role:fullstack-engineer", target: "skill:typescript", type: "REQUIRES_SKILL", properties: {} },
      { id: "e9", source: "role:fullstack-engineer", target: "company:wexa-ai", type: "OFFERED_BY", properties: {} },
    ]
  };
}
