import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, context: any) {
  const {id} = context.params as {id: string} 
  try {
    const body = await req.json();
    // const { id } = params;
    return NextResponse.json({ message: `Student ${id} updated successfully`, data: body });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  context: any
) {
  const {id} = context.params as {id: string}
  try {
    // const { id } = await params;

    if (!id) {
      return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
      )
    }
    const delStudent = await prisma.student.delete({
      where: { id },
    });
    console.log("Student deleted:", delStudent)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}


