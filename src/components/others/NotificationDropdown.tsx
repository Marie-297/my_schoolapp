"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IoIosNotifications } from "react-icons/io";

type Announcement = {
  id: number;
  title: string;
  description?: string;
  classId?: number | null;
  parentId?: string | null;
  date?: string;
};

type Props = {
  userId: string;
  role: string;
};

export default function NotificationDropdown({ userId, role }: Props) {
  const [items, setItems] = useState<Announcement[]>([]);
  const [unreadIds, setUnreadIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);

  // Fetch announcements from your backend or Supabase
  const fetchInitial = async () => {
    try {
      const res = await fetch(`/api/announcements?userId=${userId}&role=${role}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        setUnreadIds(data.map((d: Announcement) => d.id));
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  // Subscribe to real-time Supabase announcements
  useEffect(() => {
    fetchInitial();

    const channel = supabase
      .channel("realtime:announcements")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "announcements",
        },
        (payload) => {
          const newRow = payload.new as Announcement;
          // Only show if relevant to this user's role
          if (
            role === "ADMIN" ||
            (role === "STUDENT" && newRow.classId) ||
            (role === "PARENT" && newRow.parentId === userId) ||
            !newRow.classId // general announcements
          ) {
            setItems((prev) => [newRow, ...prev]);
            setUnreadIds((prev) => [newRow.id, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role]);

  const markAllRead = () => setUnreadIds([]);

  const handleItemClick = (announcement: Announcement) => {
    setUnreadIds((prev) => prev.filter((id) => id !== announcement.id));
    setSelected(announcement);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-white rounded-full p-2"
      >
        <IoIosNotifications size={22} />
        {unreadIds.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadIds.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3 z-50 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <button onClick={markAllRead} className="text-xs text-blue-500">
              Mark all read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-gray-500">No announcements yet</p>
          ) : (
            <ul className="space-y-2">
              {items.map((a) => (
                <li
                  key={a.id}
                  onClick={() => setUnreadIds((prev) => prev.filter((id) => id !== a.id))}
                  className={`p-2 rounded-md text-sm ${
                    unreadIds.includes(a.id)
                      ? "bg-blue-50 font-semibold"
                      : "bg-gray-50"
                  }`}
                >
                  <p>{a.title}</p>
                  {a.description && (
                    <p className="text-xs text-gray-500">{a.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          {/* Modal for announcement details */}
          {selected && (
            <>
              {/* Blurred background */}
              <div
                onClick={() => setSelected(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              ></div>

              {/* Modal box */}
              <div className="fixed inset-0 flex items-center justify-center z-[120]">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
                  <h2 className="text-lg font-semibold mb-2">{selected.title}</h2>
                  <p className="text-sm text-gray-700 mb-4">{selected.description}</p>
                  {selected.date && (
                    <p className="text-xs text-gray-400">
                      Posted on: {new Date(selected.date).toLocaleString()}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setSelected(null)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
