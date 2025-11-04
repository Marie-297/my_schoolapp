import Announcement from "@/components/others/Announcement";
import Attendance from "@/components/others/Attendance";
import CalendarEvent from "@/components/others/CalendarEvent";
import CountChartContainer from "@/components/others/CountChart";
import GradeCountChart from "@/components/others/CountGradeChart";
import EventList from "@/components/others/EventList";
import FinanceChart from "@/components/others/FinanceChart";
import SchoolLama from "@/components/others/SchoolLama";
import StudentSexChart from "@/components/others/StudentSexChart";
import TeacherCountChart from "@/components/others/TeacherCountChart";
import UserBox from "@/components/others/UserBox";
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Link from 'next/link'
import React from 'react'

type StudentSexData = {
  gradeId: string;
  boys: number;
  girls: number;
};
export default async function AdmindashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const students = await prisma.student.findMany({
    select: {
      sex: true,
    },
  });
  const teachers = await prisma.teacher.findMany({
    select: {
      sex: true,
    }
  })
  const user = await currentUser();
  const currentUserId = user?.id;

  // Count boys and girls
  const boys = students.filter(student => student.sex === 'MALE').length;
  const girls = students.filter(student => student.sex === 'FEMALE').length;
  const males = teachers.filter(teacher => teacher.sex === 'MALE').length;
  const females = teachers.filter(teacher => teacher.sex === 'FEMALE').length;

  const attendanceData = await prisma.student.findMany({
    select: {
      name: true,
      attendance: {
        select: {
          present: true, 
          date: true, 
        },
      },
    },
  });
  const StudentBar = await prisma.student.groupBy({
    by: ['gradeId', 'sex'],
    _count: {
      sex: true,
    },
  })
  const formattedAttendanceData = attendanceData.map((student) => {
    const present = student.attendance.filter((attendance) => attendance.present).length;
    const absent = student.attendance.length - present;

    return {
      name: student.name,
      present,
      absent,
    };
  });

  const formattedStudentSex: StudentSexData[] = [];
  StudentBar.forEach((student) => {
    let gradeGroup = formattedStudentSex.find(item => item.gradeId === `Grade ${student.gradeId}`);
    if (!gradeGroup) {
      gradeGroup = {
        gradeId: `Grade ${student.gradeId}`,
        boys: 0,
        girls: 0,
      };
      formattedStudentSex.push(gradeGroup);
    }

    if (student.sex === 'MALE') {
      gradeGroup.boys += student._count.sex;
    } else if (student.sex === 'FEMALE') {
      gradeGroup.girls += student._count.sex;
    }
  });

  const studentCounts = await prisma.student.groupBy({
    by: ['gradeId'],
    _count: { gradeId: true },
  });
  const gradeData = studentCounts.map((grade) => ({
    gradeId: `Grade ${grade.gradeId}`,
    studentCount: grade._count.gradeId,
  }));
  
  

console.log(formattedStudentSex);


 const date =
  typeof resolvedParams?.date === "string" ? resolvedParams.date : undefined;
  return (
    <>
      <div className="hidden md:block">
        <SchoolLama />
      </div>
      <div className="relative">
        {/* Register button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="blink-btn">Register</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-38">
            <DropdownMenuItem asChild>
              <Link href="/lists/register/registerStudent">New Student</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/lists/register/registerTeacher">New Teacher</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/lists/register/registerParent">New Parent</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* USER CARDS */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block">
              <CalendarEvent />
            </div>
            <div className="block lg:hidden fixed top-[182px] right-4 z-50">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-lg shadow-lg p-3 bg-blue-600 text-white hover:bg-blue-700">
                    View Calendar
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-[90vw] max-w-sm p-2 bg-white shadow-lg rounded-xl"
                >
                  <div className="max-h-[70vh] overflow-y-auto">
                    <CalendarEvent />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="h-auto">
              <TeacherCountChart male={males} female={females} />
            </div>
          </div>
          <div className="flex lg:gap-4 gap-2 justify-between flex-wrap">
            <UserBox type="admin" />
            <UserBox type="teacher" />
            <UserBox type="student" />
            <UserBox type="parent" />
          </div>
          {/* MIDDLE CHARTS */}
          <div className="flex lg:gap-4 gap-2 flex-col lg:flex-row lg:h-600px h-200px">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 lg:h-[450px] h-[200px]">
              <CountChartContainer boys={boys} girls={girls} />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-2/3 h-[270px]">
              {/* <Attendance 
               data={formattedAttendanceData}
               title="Student Attendance Overview" 
              /> */}
              
              <GradeCountChart grades={gradeData}/>
            
            </div>
          </div>
          {/* BOTTOM CHART */}
          <div>
            <StudentSexChart
              data={formattedStudentSex}
              title="Student Gender Chart"
            />
          </div>
          <div className="w-full lg:h-[500px] h-[320px]">
            <FinanceChart />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold my-4">Events</h1>
          </div>
          <div className="flex flex-col gap-4">
            <EventList dateParam={date} />
          </div>
          <Announcement params={{id: currentUserId ?? ""}} />
        </div>
      </div>
    </>
  )
}

// export default AdmindashboardPage