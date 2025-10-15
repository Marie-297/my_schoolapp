import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const classId = parseInt(params.id); // Convert to integer
    if (isNaN(classId)) {
      return NextResponse.json({ error: "Invalid class ID" }, { status: 400 });
    }

    const { name, capacity, gradeId, classTeacherId } = await req.json();

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        name,
        capacity,
        gradeId,
        classTeacherId,
      },
    });

    return NextResponse.json(updatedClass, { status: 200 });
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const {id} = params; 
    if (!id) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
    }
    const delClass = await prisma.class.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: "Class deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting class:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}