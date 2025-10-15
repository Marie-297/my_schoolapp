import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get username and/or email from Clerk user
    const email = user.emailAddresses[0]?.emailAddress ?? undefined;
    const username = user.username ?? email?.split("@")[0] ?? undefined;

    if (!username && !email) {
      return NextResponse.json({ error: "No identifier found" }, { status: 400 });
    }

    // Search the database by username (for Admins, Teachers, Students) or email (for Parents)
    const foundUser =
      (username
        ? await prisma.admin.findUnique({
            where: { username },
            select: { role: true },
          })
        : null) ??
      (username
        ? await prisma.teacher.findUnique({
            where: { username },
            select: { role: true },
          })
        : null) ??
      (username
        ? await prisma.student.findUnique({
            where: { username },
            select: { role: true },
          })
        : null) ??
      (email
        ? await prisma.parent.findUnique({
            where: { email },
            select: { role: true },
          })
        : null);

    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Role found directly from your DB
    return NextResponse.json({ role: foundUser.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
