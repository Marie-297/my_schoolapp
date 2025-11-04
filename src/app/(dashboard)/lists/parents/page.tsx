import React from 'react'
import FormContainer from "@/components/others/FormContainer";
import Pagination from "@/components/others/Pagination";
import Table from "@/components/others/Table";
import TableSearch from "@/components/others/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Parent, Student, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { RxAvatar } from "react-icons/rx";
import { GrFormView } from "react-icons/gr";
import { auth, currentUser } from "@clerk/nextjs/server";
import FilterSortControls from "@/components/others/FilterSortControl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IoMdEye } from "react-icons/io";

type ParentList = Parent & { _count: { students: number };
  students: { id: string; name: string; surname: string; sex: string; class: { name: string | null } | null;}[];
};

export default async function StudentListPage ({
   searchParams,
}: { searchParams?: any }) {
  const user = await currentUser();
  const metadata = user?.publicMetadata;
  const role = metadata?.Value; 
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Username",
      accessor: "username",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    {
      header: "Email",
      accessor: "email",
      className: "hidden lg:table-cell",
    },
    {
      header: "Child",
      accessor: "parent",
      className: "hidden lg:table-cell",
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

  const renderRow = (item: ParentList) => (
    <tr
      key={item.id}
      className="border-b border-blue-200 odd:bg-yellow-200 even:bg-blue-200 text-sm hover:bg-gray-300"
    >
      <td className="flex items-center gap-4 p-4">
        <RxAvatar size={40} className="text-gray-500 rounded-full" />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name + " " + item.surname}</h3>
          <p className="text-xs text-gray-500 lg:hidden block">{item._count.students} kid(s)</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">
        {item.students && item.students.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-xs">
                {item.students.length} {item.students.length === 1 ? "Child" : "Children"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              {item.students.map((student) => (
                <DropdownMenuItem key={student.id} className='flex justify-between'>
                  <div className='text-[10px] flex flex-col'>
                    <p>{student.name} {student.surname}</p>
                    <p>{student.sex}</p>
                    <p>Class: {student.class?.name || "N/A"}</p>
                  </div>
                  <Link
                    href={`/lists/students/${encodeURIComponent(student.id)}`}
                    className="text-sm hover:text-blue-500"
                  >
                    <IoMdEye size={12} />
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="text-gray-400 text-xs">No children</span>
        )}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/lists/parents/${encodeURIComponent(item.id)}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky" title="View" type="button">
              <GrFormView size={20} />
            </button>
          </Link>
          {role === "ADMIN" && (
            <FormContainer table="parent" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ParentWhereInput = {};
  const orderBy: Prisma.ParentOrderByWithRelationInput = {};

 if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (typeof value === "string" && value.length > 0) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { surname: { contains: value, mode: "insensitive" } },
              { phone: { contains: value, mode: "insensitive" } },
            ];
            break;
          case "sort":
            orderBy.name = value === "asc" ? "asc" : "desc";
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        _count: { select: { students: true } },
        students: {
        select: {
          id: true,
          name: true,
          surname: true,
          class: {
            select: { name: true },
          },
          sex: true,
        },
      }, 
      },
      orderBy: orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.parent.count({ where: query })
  ]);
  const grades = await prisma.grade.findMany({
    select: { level: true },
  });
  const gradeLevels = grades.map((grade) => grade.level);
  

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterSortControls grades={gradeLevels} filters={["grade"]}/>
            {role === "ADMIN" && (
              <FormContainer table="parent" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};