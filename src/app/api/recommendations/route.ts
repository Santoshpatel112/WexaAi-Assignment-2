import { NextRequest, NextResponse } from "next/server";
import { getRoleMatches } from "@/server/services/recommendation.service";
import { RecommendationSchema } from "@/server/validators/career.schema";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personId } = RecommendationSchema.partial().parse(body);
    if (!personId) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "personId is required" } },
        { status: 400 }
      );
    }
    const matches = await getRoleMatches(personId);
    return NextResponse.json({
      success: true,
      data: matches,
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
