import {
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { CiHome } from "react-icons/ci";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill, PiExamFill, PiExamBold, PiExamDuotone } from "react-icons/pi";
import { RiParentFill } from "react-icons/ri";
import { MdSubject, MdPlayLesson, MdEvent, MdAnnouncement,  MdCoPresent } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { FaRegistered } from "react-icons/fa";


export const AdminRoutes = [
  { title: "Dashboard", url: "/admin/", icon: CiHome },
  { title: "Teachers", url: "/lists/teachers", icon: GiTeacher },
  { title: "Students", url: "/lists/students", icon: PiStudentFill },
  { title: "Parent", url: "/lists/parents", icon: RiParentFill },
  { title: "Subjects", url: "/lists/subjects", icon: MdSubject },
  { title: "Classes", url: "/lists/classes", icon: SiGoogleclassroom },
  { title: "Timetable", url: "/lists/timetable", icon: SiGoogleclassroom },
  { title: "Lessons", url: "/lists/lessons", icon: MdPlayLesson },
  { title: "Exams", url: "/lists/exams", icon: HiOutlineUserGroup },
  { title: "Midterm", url: "/lists/midterm", icon: PiExamBold },
  { title: "Results", url: "/lists/results", icon: PiExamDuotone },
  { title: "Attendance", url: "/lists/attendance", icon:  MdCoPresent },
  { title: "Events", url: "/lists/events", icon: MdEvent },
  { title: "Announcements", url: "/lists/announcements", icon: MdAnnouncement },
];

export const TeacherRoutes = [
  { title: "Home", url: "/teacher/", icon: CiHome },
  // { title: "Teachers", url: "/lists/teachers", icon: GiTeacher },
  { title: "Students", url: "/lists/students", icon: PiStudentFill },
  { title: "Subjects", url: "/lists/subjects", icon: MdSubject },
  { title: "Classes", url: "/lists/classes", icon: SiGoogleclassroom },
  { title: "Lessons", url: "/lists/lessons", icon: MdPlayLesson },
  { title: "Exams", url: "/lists/exams", icon: PiExamFill },
  { title: "Midterm", url: "/lists/midterm", icon: PiExamBold },
  { title: "Results", url: "/lists/results", icon: PiExamDuotone },
  { title: "Events", url: "/lists/events", icon: MdEvent },
  { title: "Announcements", url: "/lists/announcements", icon: MdAnnouncement }
];
export const AdminMobileRoutes = [
  {
    title: "Dashboard",
    items: [
      { title: "Home", url: "/admin/", icon: CiHome },
    ],
  },
  {
    title: "People Management",
    items: [
      { title: "Teachers", url: "/lists/teachers", icon: GiTeacher },
      { title: "Students", url: "/lists/students", icon: PiStudentFill },
      { title: "Parents", url: "/lists/parents", icon: RiParentFill },
    ],
  },
  {
    title: "Academics",
    items: [
      { title: "Subjects", url: "/lists/subjects", icon: MdSubject },
      { title: "Classes", url: "/lists/classes", icon: SiGoogleclassroom },
      { title: "Timetable", url: "/lists/timetable", icon: SiGoogleclassroom },
      { title: "Lessons", url: "/lists/lessons", icon: MdPlayLesson },
    ],
  },
  {
    title: "Assessments",
    items: [
      { title: "Exams", url: "/lists/exams", icon: PiExamFill },
      { title: "Midterm", url: "/lists/midterm", icon: PiExamBold },
      { title: "Results", url: "/lists/results", icon: PiExamDuotone },
    ],
  },
  {
    title: "Records & Activities",
    items: [
      { title: "Attendance", url: "/lists/attendance", icon: MdCoPresent },
      { title: "Events", url: "/lists/events", icon: MdEvent },
      { title: "Announcements", url: "/lists/announcements", icon: MdAnnouncement },
    ],
  },
];



export const ParentRoutes = [
  { title: "Home", url: "/parent/", icon: CiHome },
  { title: "Students", url: "/lists/students", icon: PiStudentFill },
  { title: "Announcements", url: "/lists/announcements", icon: MdAnnouncement }
];

export const StudentRoutes = [
  { title: "Dashboard", url: "/student/", icon: CiHome },
  // { title: "Students", url: "/lists/students", icon: PiStudentFill },
  // { title: "Parent", url: "/lists/parents", icon: RiParentFill },
  // { title: "Subjects", url: "/lists/subjects", icon: MdSubject },
  // { title: "Classes", url: "/lists/classes", icon: SiGoogleclassroom },
  { title: "Lessons", url: "/lists/lessons", icon: MdPlayLesson },
  { title: "Exams", url: "/lists/exams", icon: PiExamFill },
  { title: "Midterm", url: "/lists/midterm", icon: PiExamBold },
  { title: "Results", url: "/lists/results", icon: PiExamDuotone },
  { title: "Attendance", url: "/lists/attendance", icon:  MdCoPresent },
  { title: "Events", url: "/lists/events", icon: MdEvent },
  { title: "Announcements", url: "/lists/announcements", icon: MdAnnouncement }
];