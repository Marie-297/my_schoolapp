import FormContainer from "@/components/others/FormContainer";
import Pagination from "@/components/others/Pagination";
import Table from "@/components/others/Table";
import TableSearch from "@/components/others/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student, Grade, Parent } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { RxAvatar } from "react-icons/rx";
import { GrFormView } from "react-icons/gr";
import { auth, currentUser } from "@clerk/nextjs/server";
import FilterSortControls from "@/components/others/FilterSortControl";

type StudentList = Student & { class: Class, grade: Grade, parent: Parent};

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  const metadata = user?.publicMetadata;
  const role = metadata?.Value; 
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Parent",
      accessor: "parent",
      className: "hidden lg:table-cell",
    },
    {
      header: "Contact",
      accessor: "contact",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
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

  const renderRow = (item: StudentList) => (
    <tr
      key={item.id}
      className="border-b border-blue-200 odd:bg-yellow-200 even:bg-blue-200 text-sm hover:bg-gray-300"
    >
      <td className="flex items-center gap-4 p-4">
        {item.img ? (
          <Image
          src={item.img || ""}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />) : (
          <RxAvatar size={40} className="text-gray-500 rounded-full" />
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name + " " + item.surname}</h3>
          <p className="text-xs text-gray-500">{item.class.name}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.grade.level}</td>
      <td className="hidden md:table-cell">{item.parent.name}</td>
      <td className="hidden md:table-cell">{item.parent.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/lists/students/${encodeURIComponent(item.id)}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky" title="View" type="button">
              <GrFormView size={20} />
            </button>
          </Link>
          {role === "ADMIN" && (
            <FormContainer table="student" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.StudentWhereInput = {};
  const orderBy: Prisma.StudentOrderByWithRelationInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.class = {
              lessons: {
                some: {
                  teacherId: value,
                },
              },
            };
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
            case "grade":
              query.grade = { level: parseInt(value, 10)};
              break; 
            case "sort":
              orderBy.name = value === "asc" ? "asc" : "desc"; 
              break;
            default:
              break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
        grade: true,
        parent: true,
      },
      orderBy: orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ]);
  const grades = await prisma.grade.findMany({
    select: { level: true },
  });
  const gradeLevels = grades.map((grade) => grade.level);
  

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterSortControls grades={gradeLevels} filters={["grade"]}/>
            {role === "ADMIN" && (
              <FormContainer table="student" type="create" />
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

export default StudentListPage;