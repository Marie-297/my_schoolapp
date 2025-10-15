"use client";

import { Class, Exams, Subject } from "@prisma/client";
import { useEffect, useState } from "react";

type MidtermList = Exams & {
  subject: {
    name: string;
    teachers: {
      id: string;
      name: string;
      surname: string;
      class: Class;
    }[];
  };
};

const MidtermListPage = () => {
  const sections: Record<string, number[]> = {
    "Lower Primary": [1, 2, 3],
    "Upper Primary": [4, 5, 6],
    JHS: [7, 8, 9],
  };

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedule, setSchedule] = useState<Record<string, Record<number, string>>>({});
  const [days, setDays] = useState<string[]>(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);
  const [timeSlots, setTimeSlots] = useState<{ start: string; end: string }[]>([
    { start: "08:00 AM", end: "09:00 AM" },
  ]);

  // ✅ Load saved data on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem("midterm-schedule");
    const savedDays = localStorage.getItem("midterm-days");
    const savedTimeSlots = localStorage.getItem("midterm-timeSlots");

    if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    if (savedDays) setDays(JSON.parse(savedDays));
    if (savedTimeSlots) setTimeSlots(JSON.parse(savedTimeSlots));
  }, []);

  // ✅ Save data automatically on every change
  useEffect(() => {
    localStorage.setItem("midterm-schedule", JSON.stringify(schedule));
    localStorage.setItem("midterm-days", JSON.stringify(days));
    localStorage.setItem("midterm-timeSlots", JSON.stringify(timeSlots));
  }, [schedule, days, timeSlots]);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        const data = await res.json();
        setSubjects(data.subjects);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  const addDay = () => setDays([...days, ""]);

  const handleSubjectChange = (
    section: string,
    classId: number,
    day: string,
    time: string,
    subjectId: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [`${classId}-${day}-${time}`]: subjectId,
      },
    }));
  };

  const handleDayChange = (index: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[index] = value.toUpperCase();
    setDays(updatedDays);
  };

  const handleTimeChange = (i: number, value: string) => {
    const [start, end] = value.split("-").map((s) => s.trim());
    const newSlots = [...timeSlots];
    newSlots[i] = { start, end };
    setTimeSlots(newSlots);
  };

  const handleSubmit = async () => {
    const scheduleArray = Object.entries(schedule).flatMap(([section, records]) =>
      Object.entries(records).map(([key, subjectId]) => {
        const [classId, day, time] = key.split("-");
        return {
          section,
          classId: parseInt(classId),
          day,
          time,
          subjectId,
        };
      })
    );

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule: scheduleArray }),
      });

      if (!res.ok) throw new Error("Failed to save schedule");
      alert("Schedule saved successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving schedule");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>

        {Object.entries(sections).map(([sectionName, classes]) => (
          <div key={sectionName} className="mb-8">
            <h2 className="text-lg font-semibold mb-2">{sectionName}</h2>

            <div className="overflow-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100">Day / Time</th>
                    {timeSlots.map((slot, i) => (
                      <th key={i} className="border p-2">
                        <input
                          type="text"
                          value={`${slot.start} - ${slot.end}`}
                          placeholder="08:00 AM - 09:00 AM"
                          onChange={(e) => handleTimeChange(i, e.target.value)}
                          className="w-48 border p-1 rounded text-center"
                        />
                      </th>
                    ))}
                    <th className="border p-2">
                      <button
                        onClick={() => setTimeSlots([...timeSlots, { start: "", end: "" }])}
                        className="text-sm text-blue-600"
                      >
                        + Add Time
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border p-2 bg-gray-50 cursor-pointer hover:bg-gray-200">
                        <input
                          type="text"
                          value={day}
                          onChange={(e) => handleDayChange(rowIndex, e.target.value)}
                          className="w-32 border p-1 rounded"
                          placeholder="Enter day"
                        />
                      </td>
                      {timeSlots.map((slot, colIndex) => (
                        <td key={colIndex} className="border p-2 text-center">
                          <select
                            aria-label={`Select subject for ${day} at ${timeSlots[colIndex].start}`}
                            title="Select subject"
                            className="w-full p-1 border rounded"
                            onChange={(e) =>
                              handleSubjectChange(
                                sectionName,
                                classes[0],
                                day,
                                `${slot.start} - ${slot.end}`,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                              <option key={subject.id} value={subject.id}>
                                {subject.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-start gap-6 mt-2">
              <button
                onClick={addDay}
                className="text-sm text-green-600"
              >
                + Add Day
              </button>

              <a
                href={`/lists/midterm/timestable/${sectionName
                  .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
                  .replace(/\s/g, "")
                  .replace(/^([A-Z])/, (m) => m.toLowerCase())
                }?schedule=${encodeURIComponent(
                  JSON.stringify(
                    Object.fromEntries(
                      Object.entries(schedule[sectionName] || {}).map(([key, subjectId]) => {
                        const subjectName =
                          subjects.find((s) => s.id === Number(subjectId))?.name || subjectId;
                        return [key, subjectName];
                      })
                    )
                  )
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Open {sectionName} Timetable
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MidtermListPage;
