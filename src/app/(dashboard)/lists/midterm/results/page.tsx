"use client";
import Link from "next/link";
import React from 'react'

const years = ["2025/2026","2024/2025", "2023/2024"];

const MidtermResult = () => {
 return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Academic Years</h1>
      <ul className="space-y-3">
        {years.map((year) => (
          <li key={year}
            className="even:bg-yellow-100 odd:bg-blue-100 hover:bg-gray-200 rounded-md"
          >
            <Link
              href={`/lists/midterm/results/${year.replace("/", "-")}`}
              className="block px-3 py-5 rounded-md font-semibold text-xl"
            >
              {year} ACADEMIC YEAR MIDTERM RESULTS
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MidtermResult