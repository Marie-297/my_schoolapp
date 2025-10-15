import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { table, type } = await req.json();
    let relatedData = {};

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    if (type !== "delete") {
      switch (table) {
        case "subject":
          relatedData = { teachers: await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } }) };
          break;
        case "class":
          relatedData = {
            teachers: await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } }),
            grades: await prisma.grade.findMany({ select: { id: true, level: true } }),
          };
          break;
        case "teacher":
          relatedData = { subjects: await prisma.subject.findMany({ select: { id: true, name: true } }) };
          break;
        case "student":
          relatedData = {
            grades: await prisma.grade.findMany({ select: { id: true, level: true } }),
            classes: await prisma.class.findMany({ include: { _count: { select: { students: true } } } }),
          };
          break;
        case "exam":
          relatedData = {
            subjects: await prisma.subject.findMany({
              where: role === "teacher" ? { teachers: { some: { id: currentUserId! } } } : {},
              select: { id: true, name: true },
            }),
          };
          break;
        case "announcement":
          relatedData = { classes: await prisma.class.findMany({ select: { id: true, name: true } }) };
          break;
      }
    }

    return NextResponse.json({ relatedData });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json({ error: "Failed to fetch form data" }, { status: 500 });
  }
}
