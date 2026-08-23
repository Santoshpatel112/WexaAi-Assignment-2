import { NextResponse } from "next/server";
import { verifyConnectivity } from "@/server/db/neo4j";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = await verifyConnectivity();
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  const grokConfigured = Boolean(process.env.GROK_API_KEY || process.env.XAI_API_KEY);

  const status = {
    status: db.connected && clerkConfigured ? "healthy" : "degraded",
    database: {
      connected: db.connected,
      latencyMs: db.latencyMs,
    },
    services: {
      clerk: clerkConfigured ? "configured" : "missing_keys",
      grok: grokConfigured ? "configured" : "missing_keys",
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: status }, { status: 200 });
}
