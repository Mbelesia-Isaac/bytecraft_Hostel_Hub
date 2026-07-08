import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const MIN_PASSWORD_LENGTH = 8;

function validatePassword(password) {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`signup:${ip}`, { max: 3, windowMs: 60 * 60 * 1000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many signups from this location. Try again later." },
        { status: 429 }
      );
    }

    const { fullName, email, phone, password, role } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "fullName, email, phone, and password are all required." },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const allowedRoles = ["SEEKER", "LANDLORD"];
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
