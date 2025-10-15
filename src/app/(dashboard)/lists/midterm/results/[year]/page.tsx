"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Grade {
  id: number;
  level: string;
}

export default function MidtermResultYearPage() {
  const params = useParams();
  const yearParam = params.year;

  const decodedYear =
    typeof yearParam === "string" ? yearParam.replace("-", "/") : "";

  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch("/api/grade");
        const data = await res.json();
        setGrades(Array.isArray(data) ? data : data.grades || []);
        console.log(data)
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);
  if (loading) {
    return <p className="p-6 text-gray-500">Loading grades...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{decodedYear || "Unknown"} Academic Midterm Results</h1>
      {grades.length === 0 ? (
        <p className="text-gray-600">No grades found.</p>
      ) : (
        <ul className="space-y-3">
          {grades.map((grade) => (
            <li
              key={grade.id}
              className="even:bg-yellow-100 odd:bg-blue-100 hover:bg-gray-200 rounded-md"
            >
              <Link
                href={`/lists/midterm/results/${yearParam}/${grade.level
                .toString()
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
                className="block p-3 font-medium"
              >
                Grade {grade.level}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
