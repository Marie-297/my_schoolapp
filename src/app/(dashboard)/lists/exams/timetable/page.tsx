import FormContainer from "@/components/others/FormContainer";
import Pagination from "@/components/others/Pagination";
import Table from "@/components/others/Table";
import TableSearch from "@/components/others/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Exams, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import FilterSortControls from "@/components/others/FilterSortControl";
import { format } from "date-fns";

type ExamList = Exams & {
  subject: {
    name : string;
    teachers: {
      id: string;
      name: string;
      surname: string;
      class: Class;
    }[]
  };
};

export default async function ExamTimetablePage ({
 searchParams,
}: { searchParams?: any }) {
const user = await currentUser();
const metadata = user?.publicMetadata;
const role = metadata?.Value; 
const currentUserId = user?.id;

const sections: Record<string, number[]> = {
  "Lower Primary": [ 1, 2, 3 ],
  "Upper Primary": [4, 5, 6],
  JHS: [7, 8, 9],
};

const exams = await prisma.exams.findMany({
  include: {
    subject: {
      select: {
        name: true,
        teachers: {
          select: { id: true, name: true, surname: true,
            classes: { select: { name: true, id: true, capacity: true, classTeacherId: true, gradeId: true }
           },
        },
      },
    },
  },
}});

const columns = [
  {
    header: "Exams",
    accessor: "exam",
  },
  {
    header: "Exam Date",
    accessor: "examdate",
  },
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Teacher Name",
    accessor: "teacher",
  },
  {
    header: "Start Time",
    accessor: "startdate",
    className: "hidden md:table-cell",
  },
  {
    header: "End Time",
    accessor: "enddate",
    className: "hidden md:table-cell",
  },
  ...(role === "ADMIN" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: ExamList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      {item.title}
    </td>
    <td className="hidden md:table-cell">
      {format(new Date(item.startDate), "yyyy-MM-dd")}
    </td>
    <td className="hidden md:table-cell">{item.subject.name}</td>
    <td className="hidden md:table-cell">
    {item.subject.teachers.map((teacher) => (
        <div key={teacher.id}>{teacher.name + " " + teacher.surname}</div>
      ))}
    </td>
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US", {hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, }).format(new Date(item.startDate))}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US", {hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, }).format(new Date(item.endDate))};
    </td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "ADMIN" || role === "teacher") && (
          <>
            <FormContainer table="exam" type="update" data={item} />
            <FormContainer table="exam" type="delete" id={item.id} data={item} />
          </>
        )}
      </div>
    </td>
  </tr>
);

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ExamsWhereInput = {};

  query.subject = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.subject = {
              teachers : {
                some: {
                  id: currentUserId!,
                },
              }
            }
            break;
          case "search":
            if (typeof value === "string" && value.trim() !== "") {
            query.subject = {
              name: { contains: value, mode: "insensitive" },
            }};
            break;
          default:
            break;
        }
      }
    }
  }

  

  switch (role) {
    case "ADMIN":
      break;
    case "teacher":
      query.subject = {
        teachers : {
          some: {
            id: currentUserId!,
          },
        }
      }
      break;
    case "student":
      query.subject = {
        teachers : {
          some: {
            classes: {
              some: {
                students: {
                  some: {
                    id: currentUserId!,
                  },
                },
              },
            },
          },
        }
      };
      break;
    case "parent":
      query.subject = {
        teachers : {
          some: {
            classes: {
              some: {
                students: {
                  some: {
                    parentId: currentUserId!,
                  },
                },
              },
            },
          },
        }
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exams.findMany({
      where: query,
      include: {
        subject: {
          select: { 
            name: true,
            teachers: { select: { id: true, name: true, surname: true,
              classes: { select: { name: true, id: true, capacity: true, classTeacherId: true, gradeId: true }
             },
          }, },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exams.count({ where: query }),
  ]);

  const firstPageExams = await prisma.exams.findMany({
    where: query,
    include: { subject: true },
    take: 10, // Fetch first 10 exams
    skip: 0,  // No skipping (first page)
  });
  console.log("First page exams:", firstPageExams.length);
  
  const secondPageExams = await prisma.exams.findMany({
    where: query,
    include: { subject: true },
    take: 10,
    skip: 10, // Fetch exams after the first 10
  });
  console.log("Second page exams:", secondPageExams.length);
  


  const groupedExams = Object.entries(sections).reduce(
    (acc, [section, classIds]) => {
      acc[section] = data.filter((exm) => classIds.includes(exm.subjectId));
      return acc;
    },
    {} as Record<string, typeof data>
  );

  const subjects = await prisma.subject.findMany({
    select: { name: true },
  })
  const subjectNames = subjects.map((subject) => subject.name);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterSortControls subjects={subjectNames} filters={["grade"]} />
            {(role === "ADMIN" || role === "teacher") && (
              <FormContainer table="exam" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {Object.entries(groupedExams).map(([section, data]) => (
      <div key={section} className="mt-6">
        <h2 className="text-lg font-bold">{section}</h2>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
    ))}
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};