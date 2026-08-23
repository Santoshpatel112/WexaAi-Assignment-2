import neo4j, { type Driver, type Session, type QueryResult } from "neo4j-driver";

let driver: Driver | null = null;

export function getDriver(): Driver | null {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME ?? "cognodb";
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !password || uri.includes("<instance-id>")) {
    return null;
  }

  if (!driver) {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
      maxConnectionPoolSize: 10,
      connectionAcquisitionTimeout: 10_000,
      connectionTimeout: 10_000,
    });
  }
  return driver;
}

export async function verifyConnectivity(): Promise<{ connected: boolean; latencyMs?: number }> {
  try {
    const d = getDriver();
    if (!d) return { connected: false };
    const start = Date.now();
    await d.verifyConnectivity();
    const latencyMs = Date.now() - start;
    return { connected: true, latencyMs };
  } catch {
    return { connected: false };
  }
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

export function getDatabase(): string {
  return process.env.NEO4J_DATABASE ?? "neo4j";
}
