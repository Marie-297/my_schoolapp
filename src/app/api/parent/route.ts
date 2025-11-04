import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    const parents = await prisma.parent.findMany({
      where: phone ? { phone: { contains: phone } } : {},
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        phone: true,
        email: true,
        address: true,
        createdAt: true,
        _count: {
          select: { students: true }, 
        },
        students: {
          select: {
            id: true,
            name: true,
            surname: true,
            classId: true,
            gradeId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(parents, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch parents:", error);
    return NextResponse.json({ error: "Failed to fetch parents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, surname, phone, email, address, password, id } = body;

    console.log("Incoming Parent Data:", body);

    const parent = await prisma.parent.create({
      data: {
        username,
        name,
        surname,
        phone,
        email,
        address,
        password,
      },
    });

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.createUser({
      password: password,
      firstName: name,
      lastName: surname,
      username,
      emailAddress: [email],
      externalId: id,
      publicMetadata: { role: "Parent" },
    });

    await prisma.parent.update({
      where: { id: parent.id },
      data: { id: clerkUser.id },
    });

    return NextResponse.json({ message: "Parent created successfully", data: parent });
  } catch (error) {
    console.error("Failed to create parent:", error);
    return NextResponse.json({ error: "Failed to create parent" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body", body)
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }

    const updatedParent = await prisma.parent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Parent updated successfully",
      data: updatedParent,
    });
  } catch (err) {
    console.error("Failed to update parent:", err);
    return NextResponse.json({ error: "Failed to update parent" }, { status: 500 });
  }
}
