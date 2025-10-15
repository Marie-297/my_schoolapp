"use client";
import { useForm } from "react-hook-form";
import InputField from "../others/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { announcementSchema, AnnouncementSchema } from "@/lib/formValidateSchema";
import { createAnnouncement, updateAnnouncement } from "@/lib/api";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";

const AnnouncementForm = ({
  type, data, setOpen, relatedData
 } : {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
 }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  const router = useRouter();
   const [state, formAction] = useActionState(
      type === "create" ? createAnnouncement : updateAnnouncement,
      { success: false, error: false }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast(`Announcement has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
    }
  }, [state, router, type, setOpen]);

  const {classes} = relatedData;

  const onSubmit = handleSubmit( async (data) => {
    const payload = {
     ...data,
     classId: data.class === "All" ? null : Number(data.class),
     appliesToAll: data.class === "all",
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/announcements", {
        method: type === "create"? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create announcement");
      const result = await response.json();
      toast.success(result.message || "Announcement added successfully!");
      router.refresh();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Failed to create/update announcement")
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Announcement" : "Update the Announcement"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Announcement title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("class")}
            defaultValue={data?.class || "All"}
          > 
            <option value="All">All Classes</option>
            {classes.map((cls: { id: number; name: string }) => (
              <option value={cls.id} key={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.class?.message && (
            <p className="text-xs text-red-400">
              {errors.class.message.toString()}
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


export default AnnouncementForm;
