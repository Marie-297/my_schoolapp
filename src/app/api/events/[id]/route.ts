import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const paths = req.nextUrl.pathname.split("/");
    const id = paths[paths.length - 1]; 
    if (!id) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: "Event ID must be a number" }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
