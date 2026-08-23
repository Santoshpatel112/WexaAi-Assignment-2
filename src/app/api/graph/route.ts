import { NextRequest, NextResponse } from "next/server";
import { getInitialGraph, getGraphStats } from "@/server/repositories/graph.repository";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? "30");
    const graphData = await getInitialGraph(limit);
    const stats = await getGraphStats();
    return NextResponse.json({
      success: true,
      data: { graph: graphData, stats },
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
