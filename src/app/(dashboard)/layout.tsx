"use client"
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/primary/Navbar";
import SideBar from "@/components/primary/Sidebar";
import { IoSchoolSharp } from "react-icons/io5";
import { useUser } from "@clerk/nextjs";
import SchoolLama from "@/components/others/SchoolLama"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="p-10">Loading...</div>;

  const metadata = user?.publicMetadata;
  const role = metadata?.Value; 
  console.log("role of user: ", role)

  return (
    <div className="flex flex-col">
      <div className="bg-blue-800 text-white flex items-center justify-center fixed top-0 left-0 w-full z-50">
        <Link href="/" className="flex items-center justify-center h-14 lg:justify-start gap-4">
          <IoSchoolSharp size={50} />
          <span className="font-extrabold md:text-3xl text-xl">Marie International School</span>
        </Link>
      </div>
      <div className="flex">
         {role === "ADMIN" && (
          <div className="w-0 md:w-[10%] lg:w-[18%] xl:w-[15%] bg-white min-h-screen shadow-lg">
            <SideBar onSelectPage={setPageTitle} />
          </div>
        )}
        {/* RIGHT */}
        <div className={`w-full ${
            role === "ADMIN" ? "md:w-[94%] lg:w-[86%]" : "w-full"
          } bg-white overflow-scroll flex flex-col pt-14`}>
          <Navbar />
          {/* Page title */}
          {role === "ADMIN" && (
            <div className="p-3 md:p-6 lg:p-4 rounded-lg uppercase border-b bg-blue-200 mb-2">
              <h1 className="text-lg md:text-2xl lg:text-4xl font-bold text-gray-800 tracking-widest">
                {pageTitle}
              </h1>
            </div>
          )}
          <div  className="lg:pl-8 clas pl-0 flex flex-col">
            {/* <SchoolLama /> */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}