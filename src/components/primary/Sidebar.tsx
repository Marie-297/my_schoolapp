"use client"
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { AdminRoutes, AdminMobileRoutes } from "./SidebarRouter";
import { RenderRoutes } from "./RenderRoute";
// import ToggleLight from "./ToggleLight";
// import { User } from "@prisma/client";
// import SignOut from "./SignOut";
import { useState, useEffect } from "react";
import { FaBars, FaEllipsisV } from "react-icons/fa";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// type SideBarProps = {
//   user: User;
// };

type SideBarProps = {
  onSelectPage?: (page: string) => void;
};

const SideBar = ({ onSelectPage }: SideBarProps) => {
  const handlePageSelect = (page: string) => {
    if (onSelectPage) onSelectPage(page);
    setIsOpen(false); 
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const adminIconsRouter = () => {
    return <RenderRoutes routes={AdminRoutes} onSelectPage={handlePageSelect} />;
  };
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const renderRoutes = () => {
    if (isMobile) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {AdminMobileRoutes.map((group) => (
            <AccordionItem key={group.title} value={group.title}>
              <AccordionTrigger>{group.title}</AccordionTrigger>
              <AccordionContent>
                {group.items.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handlePageSelect(item.url)}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <item.icon className="text-lg" />
                    {item.title}
                  </button>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    } else {
      // 🖥️ Desktop routes (flat list)
      return <RenderRoutes routes={AdminRoutes} onSelectPage={handlePageSelect} />;
    }
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
              {renderRoutes()}
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
