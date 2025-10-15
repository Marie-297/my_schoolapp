"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const terms = ["FirstTerm", "SecondTerm", "ThirdTerm"];

export default function GradePage() {
  const params = useParams();
  const yearParam = params.year;
  const gradeParam = params.grade;

  const decodedYear =
    typeof yearParam === "string" ? yearParam.replace("-", "/") : "";

  const gradeLevel =
    typeof gradeParam === "string"
      ? gradeParam.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "Unknown Grade";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        GRADE {gradeLevel} ({decodedYear} ACADEMIC YEAR)
      </h1>
      <ul className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
        {terms.map((term) => (
          <li key={term}
            className=""
           >
            <Link
              href={`/lists/midterm/exams/${yearParam}/${gradeLevel}/${term.toLowerCase()}`}
              className="block border rounded-lg px-10 bg-purple-200 hover:bg-gray-300 font-extrabold py-20 shadow-sm hover:shadow-2xl transition"
            >
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
