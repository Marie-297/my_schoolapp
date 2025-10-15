"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarEvent = () => {
  const [value, onChange] = useState<Value>(new Date());

  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value}`);
    }
  }, [value, router]);

  return (
    <div className="bg-yellow-200 p-4 rounded-xl shadow-md">
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default CalendarEvent;