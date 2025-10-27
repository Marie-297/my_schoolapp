"use client";
import { useEffect, useState } from "react";
import { BiMaleFemale } from "react-icons/bi";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  LabelList,
  Tooltip
} from "recharts";


const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Run only in the browser
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = boys + girls;
  const data = [
   
    {
      name: "Girls",
      count: girls,
      fill: "purple",
    },
    {
      name: "Boys",
      count: boys,
      fill: "darkblue",
    },
    {
      name: "Total",
      count: boys+girls,
      fill: "gold",
    },
  ];
  return (
    <div className="relative w-full lg:h-[400px] h-[150px]">
      <h1 className="font-extrabold text-2xl">Student Count Chart</h1>
      <ResponsiveContainer >
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={isMobile ? "25%" : "40%"}
          outerRadius={isMobile ? "100%" : "180%"}
          barSize={isMobile ? 20 : 50}
          data={data}
        >
          <RadialBar background dataKey="count" />
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign={isMobile ? "middle" : "top"}
            align="left"
            wrapperStyle={{
              fontSize: isMobile ? 12 : 16,
              lineHeight: "20px",
            }}
            payload={[
              { value: `Total: ${boys + girls}`, type: "circle", color: "gold" },
              { value:`Girls: ${girls}`, type: "circle", color: "purple" },
              { value: `Boys: ${boys}`, type: "circle", color: "darkblue" },
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

export default CountChart;