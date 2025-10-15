import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const event = await prisma.event.findMany({
      select: {
        title: true,
      },
    });
    return NextResponse.json(event, { status: 200 });
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, classId, startDate, endDate } = body;
    console.log("body", body);
    const classIds = Array.isArray(classId) ? classId : [classId];
    const validClasses = await prisma.class.findMany({
      where: { id: { in: classIds } },
    });

    if (validClasses.length !== classIds.length) {
      return NextResponse.json({ error: "One or more class IDs are invalid" }, { status: 400 });
    }
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        classes: { connect: classIds.map((id: number) => ({id})), },
        startDate: startTime,
        endDate: endTime
      },
    });
    console.log("event created", event);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, classId, startDate, endDate } = body;
    console.log("Incoming body", body)
    if(!id || !title || !startDate || !endDate || !description ) {
      return NextResponse.json(
        { error: "All fields are required"},
        { status: 400 }
      );
    }
    const classIds = Array.isArray(classId) ? classId : [classId];
    const validClasses = await prisma.class.findMany({
      where: { id: { in: classIds } },
    });

    if (validClasses.length !== classIds.length) {
      return NextResponse.json({ error: "One or more class IDs are invalid" }, { status: 400 });
    }
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
    // update event
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        classes: { connect: classIds.map((id: number) => ({id})), },
        startDate: startTime,
        endDate: endTime
      },
    });
    return NextResponse.json({ success: true, updatedEvent }, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}