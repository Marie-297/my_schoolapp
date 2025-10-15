"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const colors = [
  "purple",
  "blue",
  "green",
  "orange",
  "red",
  "teal",
  "gray",
  "pink",
  "cyan",
  "lime",
];

const GradeCountChart = ({ grades }: { grades: { gradeId: string; studentCount: number }[] }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width safely on client
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const sortedGrades = [...grades].sort((a, b) => a.gradeId.localeCompare(b.gradeId));
  return (
    <div className="relative w-full h-[100%]">
      <h1 className="font-extrabold text-2xl mb-4">Grade Distribution</h1>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={sortedGrades}
            dataKey="studentCount"
            nameKey="gradeId"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={(entry) => `${entry.studentCount}`}
            labelLine={false}
          >
            {grades.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout={isMobile ? "horizontal" : "vertical"} align="left" verticalAlign="top" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradeCountChart;
