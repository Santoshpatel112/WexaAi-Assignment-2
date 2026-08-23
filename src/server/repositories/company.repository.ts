import neo4j from "neo4j-driver";
import { getDriver, getDatabase } from "@/server/db/neo4j";
import { MOCK_COMPANIES, MOCK_ROLES } from "@/server/db/mock-data";
import type { Company, CompanyDetail, Role, RoleLevel } from "@/types";

function mapCompany(props: Record<string, unknown>): Company {
  return {
    id: props.id as string,
    name: props.name as string,
    industry: props.industry as string,
    location: props.location as string,
    website: props.website as string | undefined,
    logo: props.logo as string | undefined,
  };
}

export async function getCompanies(filters: {
  search?: string;
  industry?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: (Company & { roleCount: number })[]; total: number }> {
  const driver = getDriver();
  if (!driver) {
    let items = MOCK_COMPANIES.map((c) => ({ ...c, roleCount: 2 }));
    if (filters.search) {
      items = items.filter((c) => c.name.toLowerCase().includes(filters.search!.toLowerCase()));
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
      conditions.push("toLower(c.name) CONTAINS toLower($search)");
      params.search = filters.search;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await session.run(
      `MATCH (c:Company) ${whereClause} RETURN count(c) AS total`,
      params
    );
    const total = countResult.records[0]?.get("total").toNumber() ?? 0;

    const result = await session.run(
      `MATCH (c:Company) ${whereClause}
       OPTIONAL MATCH (c)<-[:OFFERED_BY]-(r:Role)
       RETURN c, count(DISTINCT r) AS roleCount
       ORDER BY c.name
       SKIP $skip LIMIT $limit`,
      params
    );

    return {
      items: result.records.map((rec) => ({
        ...mapCompany(rec.get("c").properties as Record<string, unknown>),
        roleCount: rec.get("roleCount").toNumber(),
      })),
      total,
    };
  } catch {
    const items = MOCK_COMPANIES.map((c) => ({ ...c, roleCount: 2 }));
    return { items, total: items.length };
  } finally {
    await session.close();
  }
}

export async function getCompanyById(id: string): Promise<CompanyDetail> {
  const driver = getDriver();
  if (!driver) return getFallbackCompanyDetail(id);

  const session = driver.session({ database: getDatabase() });
  try {
    const result = await session.run(
      `MATCH (c:Company {id: $companyId})
       OPTIONAL MATCH (c)<-[:OFFERED_BY]-(r:Role)
       RETURN c, collect(DISTINCT r) AS roles`,
      { companyId: id }
    );

    if (!result.records[0]) return getFallbackCompanyDetail(id);

    const rec = result.records[0];
    const company = mapCompany(rec.get("c").properties as Record<string, unknown>);

    const roles: Role[] = (rec.get("roles") as Array<{ properties: Record<string, unknown> } | null>)
      .filter(Boolean)
      .map((r) => ({
        id: r!.properties.id as string,
        title: r!.properties.title as string,
        description: r!.properties.description as string,
        level: r!.properties.level as RoleLevel,
        salaryRange: r!.properties.salaryRange as string,
      })) as Role[];

    return { ...company, roles };
  } catch {
    return getFallbackCompanyDetail(id);
  } finally {
    await session.close();
  }
}

function getFallbackCompanyDetail(id: string): CompanyDetail {
  const base = MOCK_COMPANIES.find((c) => c.id === id) || MOCK_COMPANIES[0];
  return {
    ...base,
    roles: MOCK_ROLES.slice(0, 2),
  };
}
