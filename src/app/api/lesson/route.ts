import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { IoToday } from 'react-icons/io5';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lesson =  await prisma.lesson.findMany();
    return new Response(JSON.stringify({ lesson }), { status: 200 });
  } catch (error) {
    return new Response ("Error fetching exams", {status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      dayOfWeek,
      startTime,
      endTime,
      subjectId,
      teacherId,
      classId,
      repeatWeeks = 10 // default repeat for 10 weeks
    } = body;

    const lessonName = name || "Untitled Lesson";

    if (!subjectId || !startTime || !endTime || !teacherId || !dayOfWeek || !classId) {
      return NextResponse.json({ error: "Field required" }, { status: 400 });
    }

    const createdLessons = [];

    const today = new Date();
    const targetDayIndex = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(dayOfWeek.toUpperCase());
    if (targetDayIndex === -1) {
      return NextResponse.json({ error: "Invalid dayOfWeek" }, { status: 400 });
    }

    // Find the next upcoming date matching the targetDay
    let current = new Date(today);
    while (current.getDay() !== targetDayIndex) {
      current.setDate(current.getDate() + 1);
    }

    // Find the next upcoming date that matches the desired day of the week
const baseDate = new Date(today);
while (baseDate.getDay() !== targetDayIndex) {
  baseDate.setDate(baseDate.getDate() + 1);
}

for (let week = 0; week < repeatWeeks; week++) {
  const lessonDate = new Date(baseDate); // always clone from base
  lessonDate.setDate(baseDate.getDate() + 7 * week); // add week offset

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startDate = new Date(lessonDate);
  startDate.setHours(startHour, startMinute, 0, 0);

  const endDate = new Date(lessonDate);
  endDate.setHours(endHour, endMinute, 0, 0);

  const lesson = await prisma.lesson.create({
    data: {
      name: lessonName,
      dayOfWeek,
      class: {
        connect: { id: classId },
      },
      startTime: startDate,
      endTime: endDate,
      subject: {
        connect: { id: subjectId },
      },
      teacher: {
        connect: { id: teacherId },
      },
    },
  });

  createdLessons.push(lesson);
}


    console.log(`${createdLessons.length} lessons created`);
    return NextResponse.json({ success: true, lessons: createdLessons }, { status: 201 });

  } catch (error) {
    console.error("Error creating recurring lessons:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, dayOfWeek, startTime, endTime, subjectId, teacherId, classId, repeatWeeks = 10, } = body;
    const lessonName = name || "Untitled Lesson";
    console.log('Request Body:...', body);

    // Validate required fields
    if (!id || !subjectId || !startTime || !endTime || !teacherId || !dayOfWeek || !classId ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Ensure valid dayOfWeek
    const targetDayIndex = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(dayOfWeek.toUpperCase());
    if (targetDayIndex === -1) {
      return NextResponse.json({ error: "Invalid dayOfWeek" }, { status: 400 });
    }
    const lessonId = Number(id);
    // Find the existing lesson by id
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    console.log('Existing lesson found:', existingLesson);

    if (!existingLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Parse start and end time
    let startDate: Date;
    let endDate: Date;

    if (startTime.includes('T')) {
      startDate = new Date(startTime);
    } else {
      // If only time is passed (like '13:00'), build full date from today's date
      const today = new Date();
      const [startHour, startMinute] = startTime.split(':').map(Number);
      startDate = new Date(today);
      startDate.setHours(startHour, startMinute, 0, 0);
    }

    if (endTime.includes('T')) {
      endDate = new Date(endTime);
    } else {
      const today = new Date();
      const [endHour, endMinute] = endTime.split(':').map(Number);
      endDate = new Date(today);
      endDate.setHours(endHour, endMinute, 0, 0);
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const updatedLessons = [];
    const today = new Date();
    const baseDate = new Date(today);
      while (baseDate.getDay() !== targetDayIndex) {
        baseDate.setDate(baseDate.getDate() + 1);
      }

    for (let week = 0; week < repeatWeeks; week++) {
      const lessonDate = new Date(baseDate);
      lessonDate.setDate(baseDate.getDate() + 7 * week); // add week offset

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startDate = new Date(lessonDate);
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(lessonDate);
      endDate.setHours(endHour, endMinute, 0, 0);

      // Update each lesson for the current week
      const updatedLesson = await prisma.lesson.update({
        where: { id: Number(id) + week },
        data: {
          name: lessonName,
          dayOfWeek,
          startTime: startDate,
          endTime: endDate,
          subject: {
            connect: { id: subjectId },
          },
          teacher: {
            connect: { id: teacherId },
          },
          class: {
            connect: { id: classId },
          },
        },
      });

      updatedLessons.push(updatedLesson);
    }
    // console.log("Updated lesson:", updatedLesson)

    return NextResponse.json({ success: true, updatedLessons }, { status: 200 });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}