import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const midterm = await prisma.midTerm.findMany();

    return new Response(JSON.stringify({ midterm }), { status: 200 });
  } catch (error) {
    return new Response("Error fetching midterm", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schedule } = body
    if (!schedule || !Array.isArray(schedule)) {
      return NextResponse.json(
        { error: "Invalid schedule" },
        { status: 400 }
      );
    }
   
    const createdMidterm = await Promise.all(
      schedule.map(async (entry: any) => {
        const { title, subjectId, startDate, dueDate } = entry;
        return prisma.midTerm.create({
          data: {
            title,
            subjectId,
            startDate: new Date(startDate),
            dueDate: new Date(dueDate)
          }
        });
      })
    );
  
    return NextResponse.json({ success: true, createdMidterm }, { status: 201 });
  } catch (error) {
    console.error("Error creating midterm:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
