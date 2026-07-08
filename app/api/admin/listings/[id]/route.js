import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// PATCH /api/admin/listings/:id — approve or reject, admin only
export async function PATCH(req, { params }) {
  const authUser = getUserFromRequest(req);

  if (!authUser || authUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const { status, rejectionReason } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json(
      { error: "status must be APPROVED or REJECTED." },
      { status: 400 }
    );
  }

  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason || "Not specified" : null,
      },
    });
    return NextResponse.json({ listing });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
}
