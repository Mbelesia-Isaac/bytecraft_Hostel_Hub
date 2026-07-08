import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

// POST /api/listings/:id/report — any logged-in user reports a listing
export async function POST(req, { params }) {
  const authUser = getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: "You must be logged in to report a listing." }, { status: 401 });
  }

  const limit = rateLimit(`report:${authUser.id}`, { max: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many reports submitted. Try again later." }, { status: 429 });
  }

  const { id } = await params;
  const { reason } = await req.json();

  if (!reason || reason.trim().length < 5) {
    return NextResponse.json({ error: "Please describe the issue in at least 5 characters." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const report = await prisma.report.create({
    data: { listingId: id, reporterId: authUser.id, reason: reason.trim() },
  });

  return NextResponse.json({ report }, { status: 201 });
}
