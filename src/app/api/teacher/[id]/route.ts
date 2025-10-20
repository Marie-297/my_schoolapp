import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest,  context: any) {
  const {id} = context.params as {id: string}
  try {
    // const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    await prisma.lesson.deleteMany({ where: { teacherId: id } });
    await prisma.class.updateMany({
      where: { classTeacherId: id },
      data: { classTeacherId: null }, 
    });

    const delTeacher = await prisma.teacher.delete({
      where: { id },
    });

    console.log("Deleted Teacher:", delTeacher);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
