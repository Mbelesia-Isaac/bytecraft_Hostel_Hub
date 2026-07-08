import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { validateListingInput } from "@/lib/validate";

const MAX_PENDING_PER_LANDLORD = 10;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const county = searchParams.get("county");
  const propertyType = searchParams.get("type");

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

  const where = {
    status: "APPROVED",
    ...(county ? { county: { equals: county, mode: "insensitive" } } : {}),
    ...(propertyType ? { propertyType } : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { photos: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(req) {
  const authUser = getUserFromRequest(req);

  if (!authUser) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }
  if (authUser.role !== "LANDLORD") {
    return NextResponse.json(
      { error: "Only landlord accounts can submit listings." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    const validationErrors = validateListingInput(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(" ") }, { status: 400 });
    }

    const pendingCount = await prisma.listing.count({
      where: { landlordId: authUser.id, status: "PENDING" },
    });
    if (pendingCount >= MAX_PENDING_PER_LANDLORD) {
      return NextResponse.json(
        {
          error: `You have ${pendingCount} listings awaiting review already. Wait for those to be reviewed before submitting more.`,
        },
        { status: 429 }
      );
    }

    const { title, description, propertyType, price, county, area, landmark } = body;

    const listing = await prisma.listing.create({
      data: {
        landlordId: authUser.id,
        title,
        description,
        propertyType,
        price,
        county,
        area,
        landmark: landmark || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong creating the listing." },
      { status: 500 }
    );
  }
}
