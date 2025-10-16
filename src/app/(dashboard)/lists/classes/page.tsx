import React from "react";
import FormContainer from "@/components/others/FormContainer";
import Pagination from "@/components/others/Pagination";
import Table from "@/components/others/Table";
import TableSearch from "@/components/others/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Teacher, Student } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import FilterSortControls from "@/components/others/FilterSortControl";
import { grades } from "@/lib/datum";
import { GrFormView } from "react-icons/gr";
import Link from "next/link";

type ClassList = Class & { classTeacher: Teacher, student: Student};

export default async function ClassListPage ({
  searchParams,
}: { searchParams?: any }) {

const user = await currentUser();
  console.log(user);
  const metadata = user?.publicMetadata;
  console.log(metadata);
  const role = metadata?.Value; 
  console.log(`Role ${role}`);


const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Students Number",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "hidden md:table-cell",
  },
  ...(role === "ADMIN"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: ClassList & { _count: { students: number } }) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 odd:bg-yellow-200 even:bg-blue-200 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td className="hidden md:table-cell">{item.capacity}</td>
    <td className="hidden md:table-cell">{item.gradeId}</td>
    <td className="hidden md:table-cell">{item._count.students}</td>
    <td className="hidden md:table-cell">
      {item.classTeacher?.name + " " + item.classTeacher?.surname}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "ADMIN" && (
          <>
            <FormContainer table="class" type="update" data={item} />
            <FormContainer table="class" type="delete" id={item.id} data={item} />
          </>
        )}
      </div>
    </td>
  </tr>
);

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {};
  const orderBy: Prisma.ClassOrderByWithRelationInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classTeacherId":
            query.classTeacherId = value;
            break;
          case "search":
            if (typeof value === "string") {
            query.name = { contains: value, mode: "insensitive" };}
            break;
          case "grade":
            query.grade = {
              level: Number(value),
            };
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        classTeacher: true,
        _count: {
          select: { students: true },
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
  ]);
  const grades = await prisma.grade.findMany({
    select: { level: true },
  });
  const gradeLevels = grades.map((grade) => grade.level);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterSortControls filters={["grade"]} grades={gradeLevels} />
            {role === "ADMIN" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      {/* LIST */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
          {data.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow-2xl transition">
              <div className="text-xl font-semibold text-black">{item.name}</div>
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Grade:</strong> {item.gradeId}</p>
                <p><strong>Capacity:</strong> {item.capacity}</p>
                <p><strong>Students:</strong> {item._count.students}</p>
                <p><strong>Class Teacher:</strong> {item.classTeacher?.name} {item.classTeacher?.surname}</p>
              </div>
              {role === "ADMIN" && (
                <div className="flex gap-2 mt-4">
                  <FormContainer table="class" type="update" data={item} />
                  {/* <FormContainer table="class" type="delete" id={item.id} data={item} /> */}
                  <div className="flex items-center gap-2">
                    <Link href={`/lists/classes/${encodeURIComponent(item.id)}`}>
                      <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky" title="View" type="button">
                        <GrFormView size={20} />
                      </button>
                    </Link>
                    {role === "ADMIN" && (
                      <FormContainer table="student" type="delete" id={item.id} />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};