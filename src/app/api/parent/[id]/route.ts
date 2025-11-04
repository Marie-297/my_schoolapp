import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest, context: any) {
  const {id} = context.params as {id: string} 
  try {
    const body = await req.json();
    // const { id } = params;
    return NextResponse.json({ message: `Parent ${id} updated successfully`, data: body });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update parent" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    if (!id) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }

    await prisma.parent.delete({ where: { id } });

    try {
      const clerk = await clerkClient();
      await clerk.users.deleteUser(id);
    } catch (clerkErr) {
      console.warn("Parent deleted from Prisma but not from Clerk:", clerkErr);
    }

    return NextResponse.json({ message: "Parent deleted successfully" });
  } catch (error) {
    console.error("Failed to delete parent:", error);
    return NextResponse.json({ error: "Failed to delete parent" }, { status: 500 });
  }
}