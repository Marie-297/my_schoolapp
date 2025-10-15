// src/app/api/teacher/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const exams = await prisma.exams.findMany();

    return new Response(JSON.stringify({ exams }), { status: 200 });
  } catch (error) {
    return new Response("Error fetching exams", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subjectId, startDate, endDate } = body
    if (!title || !subjectId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Field required" },
        { status: 400 }
      );
    }
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    const exams = await prisma.exams.create({
      data: {
        title,
        startDate: startTime,
        endDate: endTime,
        subjectId,
      },
    });
    const subjectDetails = await prisma.subject.findMany({
      where: {
        id: { in: Array.isArray(subjectId) ? subjectId : [subjectId] },
      },
    });
  
    return NextResponse.json({ success: true, exams, subjectDetails }, { status: 201 });
  } catch (error) {
    console.error("Error creating exams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, subjectId, startDate, endDate } = body;

    if (!id || !title || !subjectId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    const examId = Number(id);

    const existingExam = await prisma.exams.findUnique({
      where: { id: examId },
    });

    if (!existingExam) {
      console.error(`Exam with ID ${id} not found.`);
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      );
    }

    const updatedExam = await prisma.exams.update({
      where: { id: Number(id) },
      data: {
        title,
        subjectId,
        startDate: startTime,
        endDate: endTime,
      },
    });

    return NextResponse.json(
      { success: true, updatedExam },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

