"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, Dispatch, SetStateAction, useActionState } from "react";
import InputField from "../others/InputField";
import { ClassSchema, classSchema } from "@/lib/formValidateSchema";
import { createClass, updateClass } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Teacher {
  id: string;
  name: string;
  surname: string;
}

interface Grade {
  id: number;
  level: number;
}

interface RelatedData {
  teachers: Teacher[];
  grades: Grade[];
}

interface ClassFormProps {
  type: "create" | "update";
  data?: Partial<ClassSchema>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData: RelatedData;
}

const ClassForm = ({ type, data, setOpen, relatedData }: ClassFormProps) => {
  const [formState, setFormState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: data,
  });
  const [state, formAction] = useActionState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit (async (data) => {
    const payload = {
      id: data.id,
      name: data.name,
      capacity: data.capacity,
      classTeacherId: data.classTeacherId,
      gradeId: data.gradeId,
    };
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/class", {
        method: type === "create"? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }); 
      if (!response.ok) {
        throw new Error("Failed to create/update class");
      }
      const result = await response.json();
      toast.success(result.message || "Class created successfully");
      router.refresh();
      setOpen(false);
    } catch (err) {
      toast.error("Failed to create/update class");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, setOpen, router]);

  const { teachers, grades } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update the class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          register={register}
          error={errors?.name}
        />

        {data?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors?.name}
            hidden
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classTeacherId")}
          >
            {teachers.map((teacher) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.classTeacherId?.message && (
            <p className="text-xs text-red-400">{errors.classTeacherId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
          >
            {grades.map((grade) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">{errors.gradeId.message}</p>
          )}
        </div>
      </div>

      {formState.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button type="submit" className="bg-slate-950 text-white hover:bg-gray-600 p-2 rounded-md">
      {isSubmitting ? (type === "create" ? "Creating..." : "Updating...") : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
