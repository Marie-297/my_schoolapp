import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const results = await prisma.result.findMany({
      where: { studentId: id },
      include: {
        student: {
          select: { name: true, surname: true },
        },
        midterm: {
          include: {
            subject: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("❌ Error fetching student results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
