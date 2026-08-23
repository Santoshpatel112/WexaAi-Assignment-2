import { NextRequest, NextResponse } from "next/server";
import { saveOnboardingData } from "@/server/db/user-store";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const success = await saveOnboardingData(body);
    return NextResponse.json({ success: true, data: { saved: success } });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
