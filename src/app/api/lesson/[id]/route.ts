import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, dayOfWeek, startTime, endTime, subjectId, teacherId, classId } = body;

    // Validate required fields
    if (!id || !name || !subjectId || !startTime || !endTime || !teacherId || !dayOfWeek || !classId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Ensure valid dayOfWeek
    const targetDayIndex = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(dayOfWeek.toUpperCase());
    if (targetDayIndex === -1) {
      return NextResponse.json({ error: "Invalid dayOfWeek" }, { status: 400 });
    }

    // Find the existing lesson by id
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Parse start and end time
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Update the lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        name,
        dayOfWeek,
        startTime: startDate,
        endTime: endDate,
        subject: {
          connect: { id: subjectId },
        },
        teacher: {
          connect: { id: teacherId },
        },
        class: {
          connect: { id: classId },
        },
      },
    });

    return NextResponse.json({ success: true, updatedLesson }, { status: 200 });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
