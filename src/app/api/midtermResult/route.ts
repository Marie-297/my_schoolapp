import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const results = await prisma.result.createMany({
      data: data.map((r: any) => ({
        studentId: r.studentId,
        marks: Number(r.marks),
        midtermId: typeof r.midtermId === "object" ? r.midtermId.id : Number(r.midtermId),
      })),
    });

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("❌ Error creating midterm results:", error);
    return NextResponse.json(
      { error: "Failed to save midterm results" },
      { status: 500 }
    );
  }
}
