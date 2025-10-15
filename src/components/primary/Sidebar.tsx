"use client"
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { AdminRoutes, ParentRoutes, TeacherRoutes, StudentRoutes } from "./SidebarRouter";
import { RenderRoutes } from "./RenderRoute";
// import ToggleLight from "./ToggleLight";
// import { User } from "@prisma/client";
// import SignOut from "./SignOut";
import { useState } from "react";
import { FaBars, FaEllipsisV } from "react-icons/fa";

// type SideBarProps = {
//   user: User;
// };

type SideBarProps = {
  onSelectPage?: (page: string) => void;
};

const SideBar = ({ onSelectPage }: SideBarProps) => {
  const { user } = useUser();
  const handlePageSelect = (page: string) => {
    if (onSelectPage) onSelectPage(page);
    setIsOpen(false); 
  };
  const metadata = user?.publicMetadata;
  const role = metadata?.value;

  const [isOpen, setIsOpen] = useState(false);
  const adminIconsRouter = () => {
    return <RenderRoutes routes={AdminRoutes} onSelectPage={onSelectPage} />;
  };

  const parentIconsRouter = () => {
    return <>{RenderRoutes({ routes: ParentRoutes })}</>;
  };

  const teacherIconsRouter = () => {
    return <>{RenderRoutes({ routes: TeacherRoutes })}</>;
  };

  const studentIconsRouter = () => {
    return <>{RenderRoutes({ routes: StudentRoutes })}</>;
  };
  return (
    <div>
      <button
        className="sm:hidden fixed top-16 left-3 z-50 p-2 text-slate-950 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        <FaBars size={24} />
      </button>
      <div className={`fixed top-14 bottom-0 left-0 z-40 bg-white dark:bg-black dark:border-r shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-transform duration-300 w-[12rem]`}>
        <div className="flex flex-col items-start justify-between h-full pt-12">
          {/* TOP PART  */}
          <div>
            <nav className="flex flex-col items-start px-2 mx-0 overflow-y-auto dark:text-white">
            {/* {role === "teacher" && teacherIconsRouter()}
            {role === "parent" && parentIconsRouter()}
            {role === "student" && studentIconsRouter()} */}
              {adminIconsRouter()}
            </nav>
          </div>
          {/* BOTTOM PART  */}
          {/* <div className="flex flex-col items-center mx-6 space-y-6 my-8 w-full">
            <div className="flex items-center justify-start w-full">
              <SignOut />
              <p className="text-slate-950 dark:text-white font-extrabold ml-4">Sign Out</p>
            </div>
            <div className="flex items-center justify-start w-full">
              <ToggleLight />
            </div>
          </div> */}
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
    
  );
};

export default SideBar;
