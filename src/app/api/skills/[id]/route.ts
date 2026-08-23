import { NextRequest, NextResponse } from "next/server";
import { getSkillById } from "@/server/repositories/skill.repository";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = await getSkillById(id);
    return NextResponse.json({ success: true, data: skill });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
