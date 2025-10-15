import Announcements from "@/components/others/Announcement";
import BigCalendarContainer from "@/components/others/CalendarContainer";
import FormContainer from "@/components/others/FormContainer";
import Performance from "@/components/others/Performance";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoMdMailUnread } from "react-icons/io";
import { MdContactPhone, MdSubject } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { SiGoogleclassroom } from "react-icons/si";
import { RxAvatar } from "react-icons/rx";

const SingleTeacherPage = async ({
  params }: {
  params: { id: string };
}) => {
  const { id } = await Promise.resolve(params);
  const user = await currentUser();
  const metadata = user?.publicMetadata;
  const role = metadata?.Value;

  const teacher:
    | (Teacher & {
        _count: { subjects: number; lessons: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  if (!teacher) {
    return notFound();
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              {teacher.img ? (
                <Image
                  src={teacher.img}
                  alt=""
                  width={120}
                  height={120}
                  className="w-36 h-36 rounded-full object-cover"
                />) : (
                  <RxAvatar size={90} />
                )}
            </div>
            <div className="w-2/3 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {teacher.name + " " + teacher.surname}
                </h1>
                {role === "ADMIN" && (
                  <FormContainer table="teacher" type="update" data={teacher} />
                )}
              </div>
              <div className="flex flex-col gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                  <BsCalendarDateFill size={20} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(teacher.birthday)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                  <IoMdMailUnread size={20} className="text-slate-950" />
                  <span>{teacher.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                  <MdContactPhone size={20} />
                  <span>{teacher.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
           
            <div className="bg-white p-1 items-center rounded-md flex gap-4 w-full md:w-[48%]">
              < HiDocumentReport size={30}/>
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white items-center p-1 rounded-md flex gap-4 w-full md:w-[48%]">
              <MdSubject size={30} />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.subjects}
                </h1>
                <span className="text-sm text-gray-400">Subject(s)</span>
              </div>
            </div>
    
            <div className="bg-white items-center p-1 rounded-md flex gap-4 w-full md:w-[48%]">
              <SiGoogleclassroom size={30} />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.classes}
                </h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={teacher.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
           <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/lists/classes?supervisorId=${teacher.id}`}
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/students?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Students
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/lessons?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/assignments?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        {/* <Performance /> */}
        <Announcements params={{id:teacher.id}} />
      </div>
    </div>
  );
};

export default SingleTeacherPage;