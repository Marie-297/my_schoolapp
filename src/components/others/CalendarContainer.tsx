
import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const CalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
    include: {
      teacher: true,
      subject: true, 
    },
  });

  const data = dataRes.map((lesson) => ({
    title: `${lesson.subject?.name || "Unknown Subject"} \n ${lesson.teacher?.name || "Unknown Teacher"}`,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default CalendarContainer;