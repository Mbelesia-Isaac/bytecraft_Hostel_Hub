import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { fullName, email, phone, password, role } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "fullName, email, phone, and password are all required." },
        { status: 400 }
      );
    }

    const allowedRoles = ["SEEKER", "LANDLORD"]; // admins are never created via public signup
    const finalRole = allowedRoles.includes(role) ? role : "SEEKER";

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email or phone already exists." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash: hashPassword(password),
        role: finalRole,
      },
    });

    const token = signToken(user);
    return NextResponse.json({
      token,
      user: { id: user.id, fullName: user.fullName, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong creating the account." },
      { status: 500 }
    );
  }
}
