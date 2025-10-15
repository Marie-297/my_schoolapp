"use client";

import { useState } from "react";

const ViewAllSidebar = ({ data }: { data: any[] }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      {/* View All Button */}
      <span
        className="text-xs text-gray-400 cursor-pointer hover:underline"
        onClick={() => setShowSidebar(true)}
      >
        View All
      </span>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg border-l border-gray-200 p-4 z-50 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Announcements</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowSidebar(false)}
            >
              ✖
            </button>
          </div>

          {/* Full Announcement List */}
          <div className="flex flex-col gap-4">
            {data.map((announcement, index) => (
              <div key={index} className="bg-gray-100 rounded-md p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">{announcement.title}</h2>
                  <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                    {new Intl.DateTimeFormat("en-GB").format(new Date(announcement.date))}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{announcement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAllSidebar;
