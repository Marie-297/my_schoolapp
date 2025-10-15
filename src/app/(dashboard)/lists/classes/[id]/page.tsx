import Announcements from "@/components/others/Announcement";
import BigCalendarContainer from "@/components/others/CalendarContainer";
import FormContainer from "@/components/others/FormContainer";
import Performance from "@/components/others/Performance";
import StudentAttendanceCard from "@/components/others/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Class, Lesson, Prisma, Student, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PiGenderIntersexBold } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { BsCalendarDateFill } from "react-icons/bs";
import { RiParentFill } from "react-icons/ri";
import TableSearch from "@/components/others/TableSearch";
import FilterSortControls from "@/components/others/FilterSortControl";
import Table from "@/components/others/Table";
import Pagination from "@/components/others/Pagination";
import { GrFormView } from "react-icons/gr";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Announcement from "@/components/others/Announcement";
import TimetablePage from "@/components/others/Timetable";
import { MdPlayLesson } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeamUpgrade } from "react-icons/gi";

type ClassList = Class & { teacher: Teacher, student: Student, lesson: Lesson, subject: Subject}
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

const SingleClassPage = async  ({ params, searchParams }: PageProps) => {
  const { id } = await Promise.resolve(params);
  const user = await currentUser();
  const metadata = user?.publicMetadata;
  const role = metadata?.Value; 

  const classData = await prisma.class.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      grade: true, 
      classTeacher: true,
      lessons: {
        include: {
          subject: true
        }
      },
      subjects: {
        select: {
          id: true,
          name: true,
          teachers: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      },
      _count: {
        select: {
          students: true,
          lessons: true,
        },
      }, 
    },
  });
  if (!classData) return notFound();

  const teacherData = classData.classTeacher

  const studentClass = classData.grade
  ? `${classData.name || ""}`
  : "Unknown Class";


  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Gender",
      accessor: "sex",
      className: "hidden md:table-cell",
    },
    {
      header: "Registration Date",
      accessor: "createdAt",
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

  const renderRow = (student: typeof students[number]) => (
      <tr
        key={student.id}
        className="border-b border-gray-200 odd:bg-yellow-200 even:bg-blue-200 text-sm hover:bg-gray-300"
      >
        <td className="flex items-center gap-4 p-4">
          {student.img ? (
            <Image
            src={student.img || ""}
            alt=""
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />) : (
            <RxAvatar size={40} className="text-gray-500 rounded-full" />
          )}
          <div className="flex flex-col">
            <h3 className="text-xs text-gray-500">{student.name} {student.surname}</h3>
            {/* <p className="hidden md:table-cell">{item.student.age}</p> */}
          </div>
        </td>
        <td className="hidden md:table-cell">{student.sex}</td>
        <td>{new Date(student.createdAt).toLocaleDateString()}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/lists/students/${encodeURIComponent(student.id)}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky" title="View" type="button">
                <GrFormView size={20} />
              </button>
            </Link>
            {role === "ADMIN" && (
              <FormContainer table="student" type="delete" id={student.id} />
            )}
          </div>
        </td>
      </tr>
    );
  
    const { page, ...queryParams } = await searchParams;
  
    const p = page ? parseInt(page) : 1;
  
    // URL PARAMS CONDITION
  
    const query: Prisma.StudentWhereInput = {
      classId: parseInt(id, 10),
    };
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
  
    const [students, count] = await prisma.$transaction([
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
    <>
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-gray-200/10 py-6 px-4 rounded-md flex-1 flex gap-4 items-center">
          <div className="w-1/5">
            {teacherData ? (
              teacherData.img ? (
                <Image
                src={teacherData.img}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />) : (
                <RxAvatar size={90} /> )
              ) : (
                <p>No ClassTeacher Assigned</p>
              )}
          </div>
          <div className="w-2/3 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {teacherData ? (
                  teacherData.name + " " + teacherData.surname
                ) : ( <p>No ClassTeacher</p> )}
              </h1>
              {role === "ADMIN" && (
                <FormContainer table="class" type="update" data={classData} />
              )}
            </div>
            <div className="flex flex-col items-center gap-2 text-xs font-medium justify-start">
              <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                <PiGenderIntersexBold size={20} className="text-gray-800" />
                <span>
                  {teacherData ? (
                    teacherData.sex
                  ):(<p>Null</p>)}
                </span>
              </div>
              <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                <BsCalendarDateFill size={20} />
                <span>
                  {teacherData ? (
                    new Intl.DateTimeFormat("en-GB").format(teacherData.birthday)
                  ): (<p>Null</p>)}
                </span>
              </div>
              <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                <RiParentFill size={20} />
                <span>
                  {teacherData ? (
                    teacherData.phone || "-"
                  ): (<p>Null</p>)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* SMALL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* CARD */}
          <div className="bg-white p-4 rounded-md flex gap-4">
            <SiGoogleclassroom size={24} />
            <div className="">
              <h1 className="text-xl font-semibold">
                {classData._count.students}
              </h1>
              <span className="text-sm text-gray-400">Total Students</span>
            </div>
          </div>
          {/* CARD */}
          <div className="bg-white p-4 rounded-md flex gap-4">
            <MdPlayLesson size={24} />
            <div className="">
              <h1 className="text-xl font-semibold">
                {classData._count.lessons}
              </h1>
              <span className="text-sm text-gray-400">Lessons</span>
            </div>
          </div>
          {/* CARD */}
          <div className="bg-white p-4 rounded-md flex gap-4">
            <SiGoogleclassroom size={24}/>
            <div className="">
              <h1 className="text-xl font-semibold">{classData.capacity}</h1>
              <span className="text-sm text-gray-400">Class Capacity</span>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
              <Link
                className="p-3 rounded-md bg-green-100"
                href={`/lists/teachers/${classData.classTeacher?.id}`}
              >
                ClassTeacher Profile
              </Link>
              <Link
                className="p-3 rounded-md bg-pink-100"
                href={`/list/exams?classId=${""}`}
              >
                {classData.name} Exams
              </Link>
              <Link
                className="p-3 rounded-md bg-blue-100"
                href={`/list/assignments?classId=${""}`}
              >
                {classData.name} Midterm
              </Link>
              <Link
                className="p-3 rounded-md bg-lamaYellowLight"
                href={`/list/results?studentId=${""}`}
              >
                {classData.name} Results
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* MIDDLE */}
      <div>
        <TimetablePage classLessons={classData.lessons} subjects={classData?.subjects} classId={classData.id}/>
      </div>
      {/* BOTTOM */}
      <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
        <div className="bg-white w-full lg:w-2/3 p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">{studentClass}</h1>
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
          <Table columns={columns} renderRow={renderRow} data={students} />
          {/* PAGINATION */}
          <Pagination page={p} count={count} />
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Announcement params={{id}} />
        </div>
      </div>
    </>
  );
};

export default SingleClassPage;