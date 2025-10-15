"use client"

import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  surname: string;
}

interface Subject {
  id: string;
  name: string;
}

export default function ViewResults() {
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    // 1️⃣ Load saved marks from localStorage
    const savedMarks = localStorage.getItem("savedMarks");
    if (savedMarks) {
      setMarks(JSON.parse(savedMarks));
    }

    // 2️⃣ Fetch students and subjects (or hardcode if already known)
    const fetchData = async () => {
      const studentsRes = await fetch("/api/students"); // replace with your API or static data
      const subjectsRes = await fetch("/api/subjects"); // replace with your API or static data

      const studentsJson = await studentsRes.json();
      const subjectsJson = await subjectsRes.json();

      setStudents(studentsJson);
      setSubjects(subjectsJson);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Saved Marks</h1>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Student Name</th>
            {subjects.map((subject) => (
              <th key={subject.id} className="border px-4 py-2 text-center">
                {subject.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="even:bg-gray-50 odd:bg-white">
              <td className="border px-4 py-2 font-medium">
                {student.name} {student.surname}
              </td>
              {subjects.map((subject) => (
                <td key={subject.id} className="border px-2 py-2 text-center">
                  {marks[student.id]?.[subject.id] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
