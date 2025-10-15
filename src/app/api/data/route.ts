import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ 
    message:"Authenticated",
    data: { userId: userId, username: user?.username },
   },
  { status: 200 }
  );
}