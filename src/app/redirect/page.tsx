"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function RedirectPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // Get the role selected before signing in
    const role = localStorage.getItem("selectedRole") || "student";

    // Redirect based on role
    switch (role) {
      case "admin":
        router.replace("/admin");
        break;
      case "teacher":
        router.replace("/teacher");
        break;
      case "parent":
        router.replace("/parent");
        break;
      default:
        router.replace("/student");
    }
  }, [user, isLoaded, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600 font-medium">
        Redirecting to your dashboard...
      </p>
    </div>
  );
}
