import FormContainer from "@/components/others/FormContainer";
import Pagination from "@/components/others/Pagination";
import Table from "@/components/others/Table";
import TableSearch from "@/components/others/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Grade, Prisma, Subject, Teacher } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import FilterSortControls from "@/components/others/FilterSortControl";


type SubjectList = Subject & { teachers: Teacher[], subjects: Subject };

export default async function SubjectListPage ({
  searchParams,
}: { searchParams?: any }) {
  const user = await currentUser();
  const metadata = user?.publicMetadata;
  const role = metadata?.Value; 

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Teachers",
      accessor: "teachers",
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

  const renderRow = (item: SubjectList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 odd:bg-yellow-200 even:bg-blue-200 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">
        {item.teachers.map((teacher) => teacher.name+ " " + teacher.surname).join(",")}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "ADMIN" && (
            <>
              <FormContainer table="subject" type="update" data={item} />
              <FormContainer table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.SubjectWhereInput = {};
  const orderBy: Prisma.StudentOrderByWithRelationInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            if (typeof value === "string") {
            query.name = { contains: value, mode: "insensitive" };}
            break;
          case "sort":
            orderBy.name = value === "asc"? "asc" : "desc";
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      orderBy: orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);
  const subjects = await prisma.subject.findMany({
    select: { name: true },
  })
  const subjectNames = subjects.map((subject) => subject.name);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-extrabold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FilterSortControls subjects={subjectNames} filters={["subject"]} />
            {role === "ADMIN" && (
              <FormContainer table="subject" type="create" />
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