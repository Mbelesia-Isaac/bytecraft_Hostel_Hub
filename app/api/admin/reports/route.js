import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/admin/reports — all open reports, admin only
export async function GET(req) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "asc" },
    include: {
      listing: { select: { title: true, status: true } },
      reporter: { select: { fullName: true, email: true } },
    },
  });

  return NextResponse.json({ reports });
}
