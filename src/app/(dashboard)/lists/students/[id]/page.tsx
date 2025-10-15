import Announcements from "@/components/others/Announcement";
import BigCalendarContainer from "@/components/others/CalendarContainer";
import FormContainer from "@/components/others/FormContainer";
import Performance from "@/components/others/Performance";
import StudentAttendanceCard from "@/components/others/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PiGenderIntersexBold } from "react-icons/pi";
import { RxAvatar } from "react-icons/rx";
import { BsCalendarDateFill } from "react-icons/bs";
import { RiParentFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeamUpgrade } from "react-icons/gi";
import { MdSettingsBackupRestore, MdPlayLesson } from "react-icons/md";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const user = await currentUser();
  const metadata = user?.publicMetadata;
  const role = metadata?.Value; 

  const student:
    | (Student & {
        class: Class & { _count: { lessons: number } };
      })
    | null = await prisma.student.findUnique({
    where: { id },
    include: {
      class: { include: { _count: { select: { lessons: true } } } },
    },
  });
  console.log(student);

  if (!student) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-gray-200/10 py-6 px-4 rounded-md flex-1 flex gap-4 items-center">
            <div className="w-1/3">
              {student.img ? (
                <Image
                src={student.img}
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
                  {student.name + " " + student.surname}
                </h1>
                {role === "ADMIN" && (
                  <FormContainer table="student" type="update" data={student} />
                )}
              </div>
              <div className="flex flex-col items-center gap-2 text-xs font-medium justify-start">
                <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                  <PiGenderIntersexBold size={20} className="text-gray-800" />
                  <span>{student.sex}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                  <BsCalendarDateFill size={20} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(student.birthday)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                  <RiParentFill size={20} />
                  <span>{student.parentId || "-"}</span>
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
                <GiTeamUpgrade id={student.id} />
              </Suspense>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4">
              <SiGoogleclassroom size={24}/>
              <div className="">
                <h1 className="text-xl font-semibold">
                  {`Grade ${student.gradeId}`}
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4">
              <MdPlayLesson size={24} />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4">
              <SiGoogleclassroom size={24}/>
              <div className="">
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[1000px]">
          <h1>Student&apos;s Time Table</h1>
          <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/lessons?classId=${student.class.id}`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/teachers?classId=${student.class.id}`}
            >
              Student&apos;s Teacher
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?classId=${student.class.id}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/assignments?classId=${student.class.id}`}
            >
              Student&apos;s Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/results?studentId=${student.id}`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements params={{id:student.id}} />
      </div>
    </div>
  );
};

export default SingleStudentPage;