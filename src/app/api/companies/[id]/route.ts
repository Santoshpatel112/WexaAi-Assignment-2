import { NextRequest, NextResponse } from "next/server";
import { getCompanyById } from "@/server/repositories/company.repository";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const company = await getCompanyById(id);
    return NextResponse.json({ success: true, data: company });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
