"use client";

import {
  deleteClass,
  deleteExams,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
  deleteLesson,
  deleteEvent,
  deleteAnnouncement
} from "@/lib/api";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "react-toastify";
import { ContainerFormProps } from "./ContainerForm";
import { IoCloseCircle } from "react-icons/io5";
import EventForm from "../Forms/EventForm";


const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExams,
  parent: deleteSubject,
  lesson: deleteLesson,
  midterm: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteEvent,
  announcement: deleteAnnouncement,
};

const TeacherForm = dynamic(() => import("../Forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("../Forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("../Forms/Subject"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("../Forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("../Forms/ExamsForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("../Forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("../Forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
const Event = dynamic(() => import("../Forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
// TODO: OTHER FORMS

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  lesson: (setOpen, type, data, relatedData) => (
    <LessonForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
      refreshData={() => {}}	
    />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: ContainerFormProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-orange"
      : type === "update"
      ? "bg-skyBlue"
      : "bg-darkBlue";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });
    console.log("Form submitted with ID:", id);

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    if (type === "delete" && id ) {
      return (
        <form action={formAction} className="p-4 flex flex-col gap-4">
          <input type="hidden" name="id" defaultValue={id} />
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-lg border-none w-max self-center">
            Delete
          </button>
        </form>
      )}
    if (type === "create" || type === "update") {
      if (!forms[table]) {
        console.error(`Form not found for table: ${table}`);
        return <div className="text-red-600">Error: Form not found!</div>;
      }
  
      return forms[table](setOpen, type, data, relatedData);
    }
  
    return "Form not found!";
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full bg-transparent`}
        onClick={() => setOpen(true)} type="button" title={`${type} ${table}`}
      >
        <Image src={`/${type}.svg`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <IoCloseCircle size={16} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;