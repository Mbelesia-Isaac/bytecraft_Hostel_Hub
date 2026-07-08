import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// POST /api/listings/:id/save — seeker saves a listing
export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "SEEKER") {
    return NextResponse.json({ error: "Seeker access required." }, { status: 403 });
  }

  const { id } = await params;

  try {
    const saved = await prisma.savedListing.create({
      data: { seekerId: authUser.id, listingId: id },
    });
    return NextResponse.json({ saved }, { status: 201 });
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Already saved." }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not save listing." }, { status: 500 });
  }
}

// DELETE /api/listings/:id/save — seeker unsaves a listing
export async function DELETE(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "SEEKER") {
    return NextResponse.json({ error: "Seeker access required." }, { status: 403 });
  }

  const { id } = await params;

  await prisma.savedListing.deleteMany({
    where: { seekerId: authUser.id, listingId: id },
  });

  return NextResponse.json({ success: true });
}
