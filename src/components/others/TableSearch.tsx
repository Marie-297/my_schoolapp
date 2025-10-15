"use client";

import { FaSearch } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const TableSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("search", searchQuery);
    } else {
      params.delete("search"); // Remove search param when input is cleared
    }

    router.replace(`${window.location.pathname}?${params}`); // Replace URL without reloading
  }, [searchQuery, router, searchParams]);

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <FaSearch size={18} />
      <input
        type="text"
        name="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search in real-time
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
