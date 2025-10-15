import Announcements from "@/components/others/Announcement";
import { Class, Student } from "@prisma/client";
import CalendarContainer from "@/components/others/CalendarContainer";
import BigCalendar from "@/components/others/BigCalendar";
import EventCalendar from "@/components/others/EventCalendar";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { BsCalendarDateFill } from "react-icons/bs";
import { RiParentFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeamUpgrade } from "react-icons/gi";
import { MdSettingsBackupRestore, MdPlayLesson } from "react-icons/md";
import Image from "next/image";
import { RxAvatar } from "react-icons/rx";
import { PiGenderIntersexBold } from "react-icons/pi";
import { Suspense } from "react";
import TimetablePage from "@/components/others/Timetable";
import SchoolLama from "@/components/others/SchoolLama";
import Link from "next/link";

const StudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const user = await currentUser();
  const currentUserId = user?.id;

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: currentUserId! } },
    },
  });
  const student = await prisma.student.findUnique({
    where: { id: user?.id },
    include: {
      class: { include: { _count: { select: { lessons: true } } } },
    },
  });
  const classData = await prisma.class.findUnique({
    where: { id: student?.classId },
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

  console.log(classItem);
  return (
    <div className="flex flex-col">
      <SchoolLama />
      <div className="p-4 flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
            <div className="bg-gray-200/10 py-6 px-4 rounded-md flex-1 flex gap-4 items-center">
              <div className="w-1/3">
                {student?.img ? (
                  <Image
                  src={student?.img}
                  alt=""
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover"
                />) : (
                  <RxAvatar size={90} />
                )}
              </div>
              <div className="w-2/3 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">
                    {student?.name + " " + student?.surname}
                  </h1>
                </div>
                <div className="flex flex-col items-center gap-2 text-xs font-medium justify-start">
                  <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                    <PiGenderIntersexBold size={20} className="text-gray-800" />
                    <span>{student?.sex}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                    <BsCalendarDateFill size={20} />
                    <span>
                      {new Intl.DateTimeFormat("en-GB").format(student?.birthday)}
                    </span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                    <RiParentFill size={20} />
                    <span>{student?.parentId || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* SMALL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4">
                <MdSettingsBackupRestore size={24} />
                <Suspense fallback="loading...">
                  <GiTeamUpgrade id={student?.id} />
                </Suspense>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4">
                <SiGoogleclassroom size={24}/>
                <div className="">
                  <h1 className="text-xl font-semibold">
                    {`Grade ${student?.gradeId}`}
                  </h1>
                  <span className="text-sm text-gray-400">Grade</span>
                </div>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4">
                <MdPlayLesson size={24} />
                <div className="">
                  <h1 className="text-xl font-semibold">
                    {student?.class._count.lessons}
                  </h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4">
                <SiGoogleclassroom size={24}/>
                <div className="">
                  <h1 className="text-xl font-semibold">{student?.class.name}</h1>
                  <span className="text-sm text-gray-400">Class</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">TIMETABLE</h1>
            <TimetablePage classLessons={classData?.lessons ?? []} subjects={classData?.subjects ?? []} classId={classData?.id ?? 0}/>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <div className="mt-4 pl-8 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-blue-100"
              href={`/list/lessons?classId=${student?.class.id}`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-100"
              href={`/list/teachers?classId=${student?.class.id}`}
            >
              Student&apos;s ClassTeacher
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-100"
              href={`/list/exams?classId=${student?.class.id}`}
            >
              Student&apos;s Exams Result
            </Link>
            <Link
              className="p-3 rounded-md bg-yellow-100"
              href={`/list/assignments?classId=${student?.class.id}`}
            >
              Student&apos;s Midterm Result
            </Link>
            <Link
              className="p-3 rounded-md bg-green-100"
              href={`/list/results?studentId=${student?.id}`}
            >
              Student&apos;s Termly Bill
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/results?studentId=${student?.id}`}
            >
              Academic Calendar
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <EventCalendar searchParams={{}} />
          </div>
          <Announcements params={{id: currentUserId ?? ""}} />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;