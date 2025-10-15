import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gradeId = searchParams.get("gradeId"); 
    const students = await prisma.student.findMany({
      where: gradeId ? { gradeId: Number(gradeId) } : {},
      select: {
        id: true,
        name: true,
        surname: true,
        classId: true,
        gradeId: true,
        attendance: {
          select: {
            present: true, 
            date: true, 
          },
        },
      },
    });
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ message: "Student updated successfully", data: updatedStudent });
  } catch (err) {
    console.error("Failed to update student:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function POST(req: NextRequest,) {
  try {
    const body = await req.json();
    const { username, name, surname, password, address, birthday, sex, classId, gradeId, parentId, id, image } = body;
    console.log('Incoming Data:', body); 
    console.log("Attempting to create student...");
    const studentData = {
      username,
      name,
      surname,
      password,
      address,
      birthday: new Date(birthday),
      sex,
      classId,
      gradeId,
      parentId,
    };
    
    console.log("Payload for student creation:", studentData);
    
    const student = await prisma.student.create({ data: studentData });

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.createUser({
      password: password, 
      firstName: name,
      lastName: surname,
      username, 
      externalId: id, 
      publicMetadata: { role: "Student" },
    });

    await prisma.student.update({
      where: { id: student.id },
      data: {
        id: clerkUser.id,
      },
    });
    
    console.log("student created:", student);
    return NextResponse.json({ message: "Student created successfully", data: body });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
