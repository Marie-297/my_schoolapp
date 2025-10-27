import prisma from "@/lib/prisma";
import Image from "next/image";

const UserBox = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="rounded-lg odd:bg-blue-200 even:bg-purple-300 p-4 flex-1 lg:min-w-[130px] min-w-[90px] flex flex-col justify-center items-center">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2025
        </span>
      </div>
      <h1 className="text-2xl font-extrabold my-4">{data}</h1>
      <h2 className="capitalize lg:text-lg text-base font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserBox;