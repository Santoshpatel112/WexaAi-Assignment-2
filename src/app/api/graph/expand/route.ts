import { NextRequest, NextResponse } from "next/server";
import { expandNode } from "@/server/repositories/graph.repository";
import { GraphExpandSchema } from "@/server/validators/career.schema";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nodeId, nodeType, depth } = GraphExpandSchema.parse(body);
    const graphData = await expandNode(nodeId, nodeType, depth);
    return NextResponse.json({
      success: true,
      data: graphData,
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
