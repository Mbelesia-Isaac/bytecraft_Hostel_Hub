import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "ACTIVE", "SUSPENDED"];

// PATCH /api/admin/users/:id — approve, suspend, or reactivate an account
export async function PATCH(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const { accountStatus } = await req.json();

  if (!VALID_STATUSES.includes(accountStatus)) {
    return NextResponse.json(
      { error: `accountStatus must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { accountStatus },
      select: { id: true, fullName: true, email: true, role: true, accountStatus: true },
    });
    return NextResponse.json({ user });
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
