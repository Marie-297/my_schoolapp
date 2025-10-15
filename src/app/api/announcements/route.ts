import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const announcement = await prisma.announcement.findMany({
      select: {
        title: true,
      },
    });
    return NextResponse.json(announcement, { status: 200 });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, classId } = body; // Ensure frontend sends `classId`

    // Validate classId if it's provided
    if (classId) {
      const existingClass = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!existingClass) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }
    }

    // Create announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        class: classId ? { connect: { id: classId } } : undefined, // Relate to class if provided
      },
    });
    console.log("announcement created", announcement);

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Expect ?id=123 in URL

    if (!id) {
      return NextResponse.json(
        { error: "Missing announcement ID" },
        { status: 400 }
      );
    }

    // Check if announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id: Number(id) },
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    // Delete announcement
    await prisma.announcement.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Announcement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}