"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function UpperPrimaryPage() {
  const searchParams = useSearchParams();
  const scheduleParam = searchParams.get("schedule");

  const schedule = useMemo(() => {
    try {
      return scheduleParam ? JSON.parse(decodeURIComponent(scheduleParam)) : {};
    } catch {
      return {};
    }
  }, [scheduleParam]);

  const handlePrint = () => window.print();

  if (!Object.keys(schedule).length) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg text-gray-600">No timetable data found</h2>
      </div>
    );
  }

  const allKeys = Object.keys(schedule);

  const days = Array.from(
    new Set(allKeys.map((key) => key.split("-")[1]?.trim().toUpperCase()))
  );

  const timeSlots = Array.from(
    new Set(
      allKeys.map((key) => {
        const match = key.match(/^[^-]+-[^-]+-(.+)$/);
        return match ? match[1].trim() : "";
      })
    )
  ).filter(Boolean);

  return (
    <div className="bg-white p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold">Upper Primary Timetable</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Print PDF
        </button>
      </div>

      <div id="print-area">
        <table className="w-full border-collapse border border-blue-950 text-center">
          <thead>
            <tr>
              <th className="border border-blue-950 p-2 bg-blue-100">Day / Time</th>
              {timeSlots.map((time) => (
                <th key={time} className="border border-blue-950 p-2 bg-blue-100">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border p-2 border-blue-950 font-semibold bg-yellow-100">{day}</td>
                {timeSlots.map((time) => {
                  const key = allKeys.find(
                    (k) =>
                      k.includes(day) &&
                      k.includes(time)
                  );
                  const subject = key ? schedule[key] : "";
                  return (
                    <td key={time} className="border border-blue-950 p-2">
                      {subject || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area,
          #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: auto !important;
          }
          @page {
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
