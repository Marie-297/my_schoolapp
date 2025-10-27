import Link from "next/link";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { usePathname } from "next/navigation"; 

type Props = {
  routes: { url: string; title: string; icon: React.ElementType }[];
  onSelectPage?: (page: string) => void;
};

export function RenderIconsRoutes({ routes, onSelectPage }: Props) {
  const pathname = usePathname();
  return (
    <>
      {routes.map((route, index) => {
        const isActive = pathname.startsWith(route.url);
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={route.url}
                  onClick={() => onSelectPage?.(route.title)}
                  className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200
                    ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                >
                  {React.createElement(route.icon, {
                    size: 24,
                    className: isActive ? "text-white" : "text-blue-950 dark:text-white",
                  })}
                  <span className={`font-extrabold ${isActive ? "text-white" : "text-blue-950 dark:text-white"}`}>
                    {route.title}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{route.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </>
  );
}


export function RenderRoutes({ routes, onSelectPage }: Props) {
  const pathname = usePathname();

  return (
    <>
      {routes.map((route, index) => {
        const isActive = pathname.includes(route.url);
        return (
          <Link
            href={route.url}
            key={index}
            onClick={() => onSelectPage?.(route.title)}
            className={`flex items-center gap-2 p-2 rounded-md transition-all duration-200
              ${isActive ? "bg-blue-500 text-white shadow-md" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white"}`}
          >
            <div className="px-1">
              {React.createElement(route.icon, {
                size: 24,
                className: isActive ? "text-white" : "text-blue-950 dark:text-white",
              })}
            </div>
            <div className="w-30">
              <p className={`font-extrabold ${isActive ? "text-white" : "text-blue-950 dark:text-white"}`}>
                {route.title}
              </p>
            </div>
          </Link>
        );
      })}
    </>
  );
}

