#!/usr/bin/env node
import neo4j from "neo4j-driver";
import { config } from "dotenv";

config({ path: ".env" });

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USERNAME ?? "cognodb", process.env.NEO4J_PASSWORD!)
);

async function clearDb() {
  const session = driver.session({ database: process.env.NEO4J_DATABASE ?? "neo4j" });
  try {
    console.log("🗑️  Clearing all nodes and relationships...");
    await session.executeWrite((tx) => tx.run("MATCH (n) DETACH DELETE n"));
    console.log("✅ Database cleared.");
  } finally {
    await session.close();
    await driver.close();
  }
}

clearDb().catch((e) => { console.error(e); process.exit(1); });
