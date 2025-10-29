"use client"
import { FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { TfiAnnouncement } from "react-icons/tfi";
import { IoIosNotifications } from "react-icons/io";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import NotificationDropdown from "../others/NotificationDropdown";
import { supabase } from "@/lib/supabaseClient";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [classIds, setClassIds] = useState<number[]>([]);
  const [role, setRole] = useState<string>("loading...");
  if (!isLoaded) return null;

  const userName = user?.firstName || "User";

  useEffect(() => {
  const fetchRole = async () => {
    try {
      const res = await fetch("/api/user/role");
      const data = await res.json();
      setRole(data.role);
    } catch (error) {
      console.error("Error fetching role:", error);
      setRole("UNKNOWN");
    }
  };
  fetchRole();
}, []);
  return (
    <div className="flex items-center justify-between px-4 py-2 md:py-4 relative">
      {/* searchbar */}
      <div className="hidden md:flex items-center gap-4 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <FaSearch size={20} />
        <input type="text" placeholder="Search" className="w-[150px] p-2 bg-transparent border-b-2 border-gray-400 outline-none" />
      </div>

      {/* ICONS/USER */}
      <div className="flex items-center gap-2 md:gap-10 justify-end">
        <div className="bg-white rounded-full">
          <AiFillMessage size={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <TfiAnnouncement size={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        {isLoaded && user?.id && (
          <NotificationDropdown userId={user.id} role={role.toUpperCase()} />
        )}
        <div className="flex gap-2">
          <div>
            <SignedIn>
              <UserButton userProfileUrl="/profile" />
            </SignedIn>          
          </div>
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium uppercase">{userName}</span>
            <span className="text-[10px] text-gray-500 text-right uppercase">
              {role}
            </span>
          </div>
        </div>
      </div>
      {/* Mobile toggle button */}
    <div className="md:hidden flex items-center">

      {open && (
        <div className="absolute top-12 right-2 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-3">
          <AiFillMessage size={20} />
          <IoIosNotifications size={20} />
        </div>
      )}
    </div>

    </div>
  )
}

export default Navbar;