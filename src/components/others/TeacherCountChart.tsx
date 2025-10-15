"use client";
import { useState, useEffect } from "react";
import { BiMaleFemale } from "react-icons/bi";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts";


const TeacherCountChart = ({ male, female }: { male: number; female: number }) => {
  const total = male + female;
  const data = [
   
    {
      name: "Female",
      count: female,
      fill: "purple",
    },
    {
      name: "Male",
      count: male,
      fill: "green",
    },
    {
      name: "Total",
      count: male+female,
      fill: "orange",
    },
  ];
  const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="relative w-full lg:h-[400px] h-[150px] bg-blue-300 px-8 py-4 rounded-lg">
      <h1 className="font-extrabold text-2xl">Teachers Count Chart</h1>
      <ResponsiveContainer >
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={isMobile ? "35%" : "40%"}
          outerRadius={isMobile ? "120%" : "180%"}
          barSize={isMobile ? 20 : 50}
          data={data}
        >
          <RadialBar background dataKey="count" />
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="top"
            align="left"
            payload={[
              { value: `Total: ${male + female}`, type: "circle", color: "orange" },
              { value:`Female: ${female}`, type: "circle", color: "purple" },
              { value: `Male: ${male}`, type: "circle", color: "green" },
            ]}
          />
          <Tooltip
            formatter={(value, _, props) => [`${value}`, `${props.payload?.name}`]}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <BiMaleFemale
        size={30}
        className="absolute top-[70%] lg:top-[57%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-black text-white rounded-full"
      />
    </div>
  );
};

export default TeacherCountChart;