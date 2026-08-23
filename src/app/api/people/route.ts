import { NextRequest, NextResponse } from "next/server";
import { getPeople } from "@/server/repositories/person.repository";
import { PeopleFilterSchema } from "@/server/validators/career.schema";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const filters = PeopleFilterSchema.parse(params);
    const { items, total } = await getPeople(filters);
    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        hasMore: filters.page * filters.pageSize < total,
      },
    });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
