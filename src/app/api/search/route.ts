import { NextRequest, NextResponse } from "next/server";
import { searchGraph } from "@/server/repositories/graph.repository";
import { SearchSchema } from "@/server/validators/career.schema";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { q, limit } = SearchSchema.parse(params);
    const results = await searchGraph(q, limit);
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
