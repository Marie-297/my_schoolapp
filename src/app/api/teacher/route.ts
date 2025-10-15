import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        name: true,
      },
    });
    return NextResponse.json(teachers, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, id, name, surname, email, phone, address, sex, birthday, subjects } = body;
    console.log("Attempting to create user...", body);
    const teacherData = {
       username,
        password,
        name, 
        surname, 
        email, 
        phone, 
        address,  
        sex, 
        subjects: {
          connect: subjects.map((subjectId: string) => ({ id: parseInt(subjectId, 10) })),
        },
        birthday: new Date(birthday)
      };
      console.log("Subjects received:", JSON.stringify(subjects, null, 2));
      console.log("Payload for teacher creation:", JSON.stringify(teacherData, null, 2))

      const teacher = await prisma.teacher.create({ data: teacherData });
      console.log("Teacher created:", teacherData)
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.createUser({
        password: password, 
        firstName: name,
        lastName: surname,
        username, 
        externalId: id,
        publicMetadata: { role: "Teacher" }, 
      });

      await prisma.teacher.update({
        where: { id: teacher.id},
        data: {
          id: clerkUser.id,
        }
      });
      console.log("Teacher created:", teacher);
      return NextResponse.json({mmessage: "Teacher created successfully", data: body});
  } catch (err) {
    return NextResponse.json({ error: "Failed to create teacher"}, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      console.error("❌ Request body is null or invalid JSON");
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    if (!body.id) {
      console.error("❌ Missing teacher ID in request body");
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }
    
    const updatedTeacher  = await prisma.teacher.update({
      where: { id: body.id },
      data: { 
        username: body.username,
        password: body.password,
        phone: body.phone,
        address: body.address,
        name: body.name,
        surname: body.surname,
        email: body.email,
        sex: body.sex,
        img: body.img,
        birthday: new Date(body.birthday),
        subjects: body.subjects
          ? {
              set: body.subjects.map((subjectId: string) => ({ id: parseInt(subjectId, 10) })),
            }
          : undefined,
      },
    })
    if (!updatedTeacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    console.log("Teacher updated successfully:", updatedTeacher);
    return NextResponse.json({ message: "Teacher updated successfully", data: updatedTeacher });
  } catch (err) {
    console.error("Failed to update teacher:", err);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}