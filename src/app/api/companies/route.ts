import { NextRequest, NextResponse } from "next/server";
import { getCompanies } from "@/server/repositories/company.repository";
import { CompanyFilterSchema } from "@/server/validators/career.schema";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const filters = CompanyFilterSchema.parse(params);
    const { items, total } = await getCompanies(filters);
    return NextResponse.json({
      success: true,
      data: { items, total, page: filters.page, pageSize: filters.pageSize, hasMore: filters.page * filters.pageSize < total },
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
