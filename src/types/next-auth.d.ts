// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role?: "admin" | "teacher" | "student" | "parent"; // Adjust roles as needed
    };
  }

  interface JWT {
    id: string;
    username: string;
    role?: "admin" | "teacher" | "student" | "parent";
  }
}

