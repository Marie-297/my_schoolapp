"use client";
import { grades } from "@/lib/datum";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StudentSexProps {
  data: { gradeId: string; boys: number; girls: number }[];
  title?: string;
}
const StudentSexChart : React.FC<StudentSexProps> = ({ data, title }) => {
  const validData = data && Array.isArray(data) ? data : [];
  const sortedValidData = [...validData].sort((a, b) => a.gradeId.localeCompare(b.gradeId));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 760);
    handleResize(); // run once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {title && <h2 className="text-2xl font-extrabold mb-4">{title}</h2>}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={isMobile ? 200 : 500} data={sortedValidData} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="gradeId"
            axisLine={false}
            tick={{ fill: "black", fontSize: isMobile ?	8 : 14}}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "black", fontSize: isMobile ?	12 : 16 }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "darkgrey" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px", fontSize: isMobile ? 14 : 18, }}
          />
          <Bar
            dataKey="boys"
            fill="#3b82f6"
            legendType="circle"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="girls"
            fill="#f9a8d4"
            legendType="circle"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default StudentSexChart;