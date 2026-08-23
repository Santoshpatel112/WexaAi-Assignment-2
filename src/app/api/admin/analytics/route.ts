import { NextResponse } from "next/server";
import { getAdminAnalytics } from "@/server/services/admin-service";

export async function GET() {
  try {
    const data = await getAdminAnalytics();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
