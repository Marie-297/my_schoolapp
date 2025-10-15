"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../others/InputField";
import {
  examSchema,
  ExamSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidateSchema";
import {
  createExams,
  // createSubject,
  updateExams,
  deleteExams,
  // updateSubject,
} from "@/lib/api";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createExams : updateExams,
    { success: false, error: false }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit( async (data) => {
    const payload = {
      id: data.id,
      title: data.title,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null, 
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      subjectId: data.subjectId,
    };
    setIsSubmitting(true);
    try {
      const response = await fetch ("/api/exams", {
        method: type === "create"? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create/update exam");
      }
      const result = await response.json();
      toast.success(result.message || "exams successfully");
      router.refresh();
      setOpen(false);
    } catch (err) {
      toast.error("Failed to create/update exam");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
    }
  }, [state, router, type, setOpen]);

  const { subjects } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new exam" : "Update the exam"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startDate"
          defaultValue={data?.startDate}
          register={register}
          error={errors?.startDate}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endDate"
          defaultValue={data?.endDate}
          register={register}
          error={errors?.endDate}
          type="datetime-local"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
            defaultValue={data?.subjects}
          >
            {subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-slate-950 text-white font-semibold p-2 rounded-md hover:bg-gray-600">
        {isSubmitting ? (type === "create" ? "Creating..." : "Updating...") : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ExamForm;
