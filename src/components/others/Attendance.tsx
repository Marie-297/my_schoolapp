"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AttendanceProps {
  data: { name: string; present: number; absent: number }[];
  title?: string;
}
const Attendance : React.FC<AttendanceProps> = ({ data, title }) => {
  const validData = data && Array.isArray(data) ? data : [];
  return (
    <>
      {title && <h2 className="text-2xl font-extrabold mb-4">{title}</h2>}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={validData} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "black" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "black" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "darkgrey" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="present"
            fill="lightblue"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="red"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default Attendance;