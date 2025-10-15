"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", income: 4000, expense: 2400, },
  { name: "Feb", income: 3000, expense: 1398, },
  { name: "Mar", income: 2000, expense: 800, },
  { name: "Apr", income: 3780, expense: 2908, },
  { name: "May", income: 5890, expense: 2800, },
  { name: "Jun", income: 5390, expense: 1800, },
  { name: "Jul", income: 6490, expense: 2300, },
  { name: "Aug", income: 6490, expense: 1800, },
  { name: "Sep", income: 6590, expense: 2300, },
  { name: "Oct", income: 7490, expense: 2800, },
  { name: "Nov", income: 7490, expense: 2400, },
  { name: "Dec", income: 7590, expense: 3300, },
];

const FinanceChart = () => {
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat().format(value);
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 760);
    handleResize(); // run once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">Finance</h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: isMobile ? 30: 0,
            left: isMobile ? 70: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
            angle={-45}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db", fontSize:"14px"}} tickLine={false}  tickMargin={20} tickFormatter={(value) => `GH₵${formatNumber(value)}`} />
          <Tooltip formatter={(value) => `GH₵${value}`} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="blue"
            strokeWidth={5}
          />
          <Line type="monotone" dataKey="expense" stroke="darkred" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;