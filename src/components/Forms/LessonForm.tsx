'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../others/InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidateSchema";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { createLesson, updateLesson } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonForm = ({
  type, data, setOpen, relatedData,refreshData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
  refreshData: () => void;
}) => {
  const DaysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      id: data?.id || undefined,
      dayOfWeek: data?.dayOfWeek || "",
      subject: data?.subject || "",
      classId: data?.classId || "",
      teacherId: data?.teacherId || "", 
    },
  });
  
  const [classes, setClasses] = useState<{ id: number; level: string }[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    typeof data?.subject === "number" ? data.subject : null
  );
  const [filteredTeachers, setFilteredTeachers] = useState<
    { id: number; name: string; surname: string }[]
  >([]);
  const router = useRouter();
  const { subjects } = relatedData;

  useEffect(() => {
    if (selectedSubjectId && subjects) {
      const subject = subjects.find((s: any) => s.id === selectedSubjectId);
      if (subject?.teachers) {
        setFilteredTeachers(subject.teachers); 
      } else if (subject?.teacher) {
        setFilteredTeachers([subject.teacher]);
      } else {
        setFilteredTeachers([]);
      }
    } else {
      setFilteredTeachers([]);
    }
  }, [selectedSubjectId, subjects]);
  useEffect(() => {
    if (data?.subject) {
      setSelectedSubjectId(data.subject);  
    }
  }, [data?.subject]);
  
  useEffect(() => {
    const generatedClasses = Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      level: `class${i + 1}A`,
    }));
    setClasses(generatedClasses);
  }, []);
  useEffect(() => {
    if (data) {
      setValue("dayOfWeek", data?.dayOfWeek || "");
      setValue("subject", data?.subject || "");
      setValue("classId", data?.classId || "");
      setValue("teacherId", data?.teacherId || "");
    }
  }, [data, setValue]);
  
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const onSubmit = handleSubmit( async (data) => {
    console.log("Id:", data.id);
    const payload = {
      id: data.id,
      subjectId: data.subject,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      classId: data.classId,
      teacherId: data.teacherId,
      dayOfWeek: data.dayOfWeek,
    };
    console.log("payload:", payload);
    setIsSubmitting(true);
    console.log("Submitting data:", data);
    try {
      const response = await fetch ("/api/lesson", {
        method: type === "create"? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create/update lesson");
      }
      const result = await response.json();
      console.log('Toast message:', result.message || "Lesson created/updated successfully");
      toast.success(result.message || "Lesson created/updated successfully");
      refreshData();  
      setOpen(false);
    } catch (err) {
      toast.error("Failed to create/update lesson");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"? "Create a new lesson" : "Update the lesson"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subject", {
              valueAsNumber: true,
            })}
            onChange={(e) => {
              const subjectId = parseInt(e.target.value);
              setSelectedSubjectId(subjectId);
              setValue("subject", subjectId);
              const subject = subjects.find((sub: any) => sub.id === subjectId);
              setFilteredTeachers(subject?.teachers || []);
            }}
          >
            <option value="" disabled>Select a subject</option>
            {subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day of the Week</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("dayOfWeek")}
            defaultValue={data?.dayOfWeek ?? ""}
          >
            <option value="" disabled>Select a day</option>
            {DaysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          {errors.dayOfWeek && (
            <p className="text-xs text-red-400">{errors.dayOfWeek.message}</p>
          )}
        </div>
        <InputField
          label="Start Time"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors.startTime}
          type="time"
        />
        <InputField
          label="End Time"
          name="endTime"
          register={register}
          defaultValue={data?.endTime}
          error={errors.endTime}
          type="time"
        />
        <InputField
          label="Class"
          name="classId"
          register={register}
          defaultValue={data?.classId}
          error={errors.classId}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId}
            disabled={!selectedSubjectId || filteredTeachers.length === 0}
          >
            <option value="" disabled>Select a teacher</option>
            {filteredTeachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">{errors.teacherId.message.toString()}</p>
          )}
        </div>

      </div>
     
      <button
        className="bg-slate-950 text-white font-semibold p-2 rounded-md hover:bg-gray-600">
          {isSubmitting ? (type === "create" ? "Creating..." : "Updating...") : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;