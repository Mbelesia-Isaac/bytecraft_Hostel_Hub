import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

async function loadOwnedListing(id, authUser) {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return { error: "Listing not found.", status: 404 };
  if (listing.landlordId !== authUser.id) {
    return { error: "You don't own this listing.", status: 403 };
  }
  return { listing };
}

export async function PATCH(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "LANDLORD") {
    return NextResponse.json({ error: "Landlord access required." }, { status: 403 });
  }

  const { id } = await params;
  const check = await loadOwnedListing(id, authUser);
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json();
  const allowedFields = ["title", "description", "price", "county", "area", "landmark"];
  const data = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  data.status = "PENDING";

  const listing = await prisma.listing.update({ where: { id }, data });
  return NextResponse.json({ listing });
}

export async function DELETE(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser || authUser.role !== "LANDLORD") {
    return NextResponse.json({ error: "Landlord access required." }, { status: 403 });
  }

  const { id } = await params;
  const check = await loadOwnedListing(id, authUser);
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
