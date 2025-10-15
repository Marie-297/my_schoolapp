"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../others/InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidateSchema";
import { createSubject, updateSubject } from "@/lib/api";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const onSubmit = handleSubmit( async (data) => {
    const payload = {
      id: data.id,
      name: data.name,
      teachers: data.teachers,
    };
    setIsSubmitting(true);
    try {
      const response  = await fetch("/api/subjects", {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create/update subject");
      }
      const result = await response.json();
      toast.success(result.message || "subject created successfully")
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create/update subject");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
    console.log(payload)
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Update the subject"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teachers")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
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

export default SubjectForm;