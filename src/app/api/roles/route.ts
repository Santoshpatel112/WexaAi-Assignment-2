import { NextRequest, NextResponse } from "next/server";
import { getRoles } from "@/server/repositories/role.repository";
import { RoleFilterSchema } from "@/server/validators/career.schema";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const filters = RoleFilterSchema.parse(params);
    const { items, total } = await getRoles(filters);
    return NextResponse.json({
      success: true,
      data: { items, total, page: filters.page, pageSize: filters.pageSize, hasMore: filters.page * filters.pageSize < total },
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
