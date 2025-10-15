import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";


export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Request Body:", body);

  const { clerkId, username, password, role, name, surname, birthday, sex, address, phone} = body; 
  console.log({ clerkId, username, password, role, name, surname, birthday, sex, address, phone });

  const validBirthday = !isNaN(Date.parse(birthday)) ? new Date(birthday) : new Date("2020-01-01");

  if (!username || !password || !role) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400 }
    );
  }

  try {
    const userData: any = {
      id: clerkId,
      username: username,
      password: password,
      role: role,
      name: name,
      surname: surname,
      birthday: validBirthday,
      sex: sex,
      address: address,
    };

    // Add phone to userData only if role is TEACHER or PARENT
    if (role === "teacher" || role === "parent") {
      userData.phone = phone;
    }
    switch (role) {
      case "admin":
        await prisma.admin.upsert({
          where: { id: clerkId },
          update: { username: username, password: password },
          create: { id: clerkId, password, username },
        });
        break;

      case "teacher":
        await prisma.teacher.upsert({
          where: { id: clerkId },
          update: { password, username },
          create: {
            role: "teacher",
            ...userData,
          },
        });
        break;

      case "parent":
        await prisma.parent.upsert({
          where: { id: clerkId },
          update: { password, username },
          create: {
            role: "parent",
            ...userData,
          },
        });
        break;

      case "student":
      default:
        await prisma.student.upsert({
          where: { id: clerkId },
          update: { username, password },
          create: {
            id: clerkId,
            username: username,
            name: name,
            password: password,
            role: "student",
            address: address,
            surname: surname,
            sex: sex,
            birthday: validBirthday,
            parentId: "parent1", 
            classId: 1,
            gradeId: 1,
          },
        });
        break;
    }

    return new Response(
      JSON.stringify({ message: "User synced successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error details:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
