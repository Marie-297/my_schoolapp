import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure you have Prisma set up properly

export async function GET() {
  try {
    const allClasses = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        lessons: {
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            classId: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
            teacherId: true
          },
        },
      },
    });

    return NextResponse.json(allClasses, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { name, capacity, gradeId, classTeacherId } = await req.json();

    if (!name || !capacity || !gradeId) {
      return NextResponse.json(
        { error: "Missing required fields: name, capacity, or gradeId" },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        capacity,
        gradeId,
        classTeacherId, 
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, capacity, gradeId, classTeacherId } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
    }

    const updatedClass = await prisma.class.update({
      where: { id },
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

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
    }

    await prisma.class.delete({ where: { id } });

    return NextResponse.json({ message: "Class deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
