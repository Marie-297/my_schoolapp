
import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        teachers: true, 
      },
    });

    return new Response(JSON.stringify({ subjects }), { status: 200 });
  } catch (error) {
    return new Response("Error fetching subjects", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, teachers } = body
    if (!name || !Array.isArray(teachers) || teachers.length === 0) {
      return NextResponse.json(
        { error: "Subject name and teacherIds are required" },
        { status: 400 }
      );
    }
    const teacherIds = teachers;

    if (teachers.length !== teacherIds.length) {
      return NextResponse.json(
        { error: "Some teacher IDs are invalid." },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        teachers: {
          connect: teacherIds.map((id: string) => ({ id })),
        },
      },
    });
    console.log("Subject created successfully:", subject);
    const teacherDetails = await prisma.teacher.findMany({
      where: {
        id: { in: teacherIds },
      },
    });
    

    return NextResponse.json({ success: true, subject, teacherDetails }, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id,name,teachers } = body;
    console.log('Received data for update:', body);
    if (!id || !name || !Array.isArray(teachers) || teachers.length === 0) {
      return NextResponse.json(
        { error: "Subject id, name, and teacherIds are required" },
        { status: 400 }
      );
    }

    // Check if all teacher IDs are valid
    const teacherIds = teachers;
    const teachersData = await prisma.teacher.findMany({
      where: {
        id: { in: teacherIds },
      },
    });

    if (teachers.length !== teachersData.length) {
      return NextResponse.json(
        { error: "Some teacher IDs are invalid." },
        { status: 400 }
      );
    }

    // Update the subject
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        teachers: {
          set: teacherIds.map((id: string) => ({ id })),
        },
      },
    });

    console.log("Updated Subject", updatedSubject);
    return NextResponse.json({ message: "Subject updated successfully", data: updatedSubject });
  } catch (err) {
    console.error("Failed to update subject:", err);

    // Log the actual error message for better debugging
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}
