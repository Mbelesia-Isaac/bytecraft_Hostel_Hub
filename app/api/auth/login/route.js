import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { email, password } = await req.json();

    const limit = rateLimit(`login:${ip}:${email}`, { max: 5, windowMs: 15 * 60 * 1000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    if (user.accountStatus === "SUSPENDED") {
      return NextResponse.json(
        { error: "This account has been suspended. Contact support if you think this is a mistake." },
        { status: 403 }
      );
    }

    const token = signToken(user);
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        role: user.role,
        accountStatus: user.accountStatus,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong logging in." },
      { status: 500 }
    );
  }
}
