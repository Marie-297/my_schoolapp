import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const paths = req.nextUrl.pathname.split("/");
    const id = paths[paths.length - 1]; 
    if (!id) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    const examId = parseInt(id, 10);
    if (isNaN(examId)) {
      return NextResponse.json({ error: "Exam ID must be a number" }, { status: 400 });
    }

    await prisma.exams.delete({
      where: { id: examId },
    });

    return NextResponse.json({ success: true, message: "Exam deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
