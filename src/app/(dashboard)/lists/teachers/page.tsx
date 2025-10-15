import FormContainer from "@/components/others/FormContainer";
import Pagination from "@/components/others/Pagination";
import Table from "@/components/others/Table";
import TableSearch from "@/components/others/TableSearch";
import prisma from "@/lib/prisma";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GrFormView } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import FilterSortControls from "@/components/others/FilterSortControl";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[], };

const TeacherListPage = async ({
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
      header: "Teacher ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Classes",
      accessor: "classes",
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
    ...(role === "ADMIN"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: TeacherList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-blue-200 odd:bg-yellow-200 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {item.img ? (
           <Image
           src={item.img || "/noAvatar.png"}
           alt=""
           width={40}
           height={40}
           className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
         />
        ) : (
          <RxAvatar size={40} className="text-gray-500 rounded-full" />
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name+" "+item.surname}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">
        {item.subjects.map((subject) => subject.name).join(",")}
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-col">
          <span>{item.classes.map((classItem) => classItem.name).join(", ")}</span>
          <span className="italic text-xs text-gray-500">{item.classes
            .map((classItem) => `Grade ${classItem.gradeId}`)
            .filter((level, index, self) => self.indexOf(level) === index)
            .join(", ")}
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/lists/teachers/${item.id}`}>
            <button title="View Teacher" className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <GrFormView size={18} />
            </button>
          </Link>
          {role === "ADMIN" && (
            <FormContainer table="teacher" type="delete" id={item.id} data={data} />
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;
  const query: Prisma.TeacherWhereInput = {};
  const orderBy: Prisma.TeacherOrderByWithRelationInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "gradeId":
            query.classes = {
              some: {
                grade: {
                  id: parseInt(value),
                }
              },
            };
            break;
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { email: { contains: value, mode: "insensitive" } },
              { phone: { contains: value, mode: "insensitive" } },
              { address: { contains: value, mode: "insensitive" } },
              {
                subjects: {
                  some: {
                    name: { contains: value, mode: "insensitive" },
                  },
                },
              },
              {
                classes: {
                  some: {
                    name: { contains: value, mode: "insensitive" },
                  },
                },
              },
            ];
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
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: {
          include: {
            grade: {
              select: { id: true },
            }
          }
        },
      },
      orderBy: orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);
  const grades = await prisma.grade.findMany({
    select: { id: true },
  });
  const gradeLevels = grades.map((grade) => grade.id);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterSortControls filters={["gradeId"]} gradeId={gradeLevels} />
            {role === "ADMIN" && (
              <FormContainer table="teacher" type="create" />
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

export default TeacherListPage;