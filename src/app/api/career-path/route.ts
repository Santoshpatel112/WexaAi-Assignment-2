import { NextRequest, NextResponse } from "next/server";
import { getCareerPath } from "@/server/services/recommendation.service";
import { CareerPathSchema } from "@/server/validators/career.schema";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personId, targetRoleId } = CareerPathSchema.parse(body);
    const careerPath = await getCareerPath(personId, targetRoleId);
    return NextResponse.json({
      success: true,
      data: careerPath,
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
