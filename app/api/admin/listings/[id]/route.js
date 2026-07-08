import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

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
        reviewedById: authUser.id,
        reviewedAt: new Date(),
      },
      include: {
        reviewedBy: { select: { fullName: true, email: true } },
      },
    });
    return NextResponse.json({ listing });
  } catch (err) {
    console.error("Admin listing update failed:", err);
    if (err.code === "P2025") {
      // Prisma's actual "record not found" error code
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Something went wrong updating the listing.", detail: err.message },
      { status: 500 }
    );
  }
}
