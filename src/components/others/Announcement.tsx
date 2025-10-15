import prisma from "@/lib/prisma";
import ViewAllSidebar from "./ViewAllBtn";
import { currentUser } from "@clerk/nextjs/server";
type PageType = "TEACHER" | "STUDENT" | "PARENT";

const Announcement = async ({ params }: { params: {id:string} }) => {
   const user = await currentUser();
    const currentUserId = user?.id;
    const metadata = user?.publicMetadata;
  
    const role = metadata?.Value;

  const userId = params.id
  // let classIds: string[] = [];

  const student = await prisma.student.findUnique({
    where: { id: userId},
    select: { classId: true },
  });
  console.log("Student Data:", student);
  const teacher = await prisma.lesson.findMany({
    where: { teacherId: userId},
    select: { classId: true },
  });
  const parent = await prisma.student.findMany({
    where: { parentId: userId},
    select: { classId: true },
  });

  const teacherClassIds = teacher.map(t => t.classId);
  const parentClassIds = parent.map(p => p.classId);

  // Collect all classIds
  const allClassIds = [
    ...(student?.classId ? [student.classId] : []), // Convert single value to array if it exists
    ...teacherClassIds,
    ...parentClassIds,
  ];


  const data = await prisma.announcement.findMany({
    orderBy: { date: "desc" },
    where: role === "ADMIN" && currentUserId === userId ? {} : {
      OR: [
        {classId: { in: allClassIds }},
        {classId: null}
      ]
    },
    include: {
      class: true,
    }
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <ViewAllSidebar data={data} />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
          </div>
        )}
        {data[1] && (
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
        {data[3] && (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[3].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[3].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[3].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcement;