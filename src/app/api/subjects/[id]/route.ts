import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { id } = params;
    
    return NextResponse.json({ message: `Subject ${id} updated successfully`, data: body });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}
