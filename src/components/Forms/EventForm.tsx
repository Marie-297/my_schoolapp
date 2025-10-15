"use client";
import { useForm } from "react-hook-form";
import InputField from "../others/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { announcementSchema, AnnouncementSchema, eventSchema, EventSchema } from "@/lib/formValidateSchema";
import { createAnnouncement, createEvent, updateAnnouncement, updateEvent } from "@/lib/api";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";

const EventForm = ({
  type, data, setOpen, relatedData
 } : {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
 }) => {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const router = useRouter();
   const [state, formAction] = useActionState(
      type === "create" ? createEvent : updateEvent,
      { success: false, error: false }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
    }
  }, [state, router, type, setOpen]);

  const {classes} = relatedData;

  const onSubmit = handleSubmit( async (data) => {
    const payload = {
      id: data?.id,
     title: data.title,
     description: data.description,
     startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
     endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
     classId: selectedClassIds.includes("all") ? classes.map((cls: { id: number }) => cls.id) : selectedClassIds.map(id => Number(id)),
    }
    console.log("payload:", payload)
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events", {
        method: type === "create"? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create/update Event");
      const result = await response.json();
      toast.success(result.message || "Event added/updated successfully!");
      router.refresh();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Failed to create/update Event")
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Event" : "Update an Event"}
      </h1>
      {type === "update" && data?.id && (
        <input type="hidden" value={data.id} {...register("id")} />
      )}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event title"
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
          <label htmlFor="class-select" className="text-xs text-gray-500">Class</label>
          <select
            id="class-select"
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={selectedClassIds}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, (option) => option.value);
              if (values.includes("all")) {
                // If "all" is selected, select all class IDs
                setSelectedClassIds(["all", ...classes.map((cls: { id: number }) => cls.id.toString())]);
              } else {
                // Otherwise, set the selected values
                setSelectedClassIds(values.filter((v) => v !== "all"));
              }
            }}
          >
            <option value="all">All Classes</option>
            {classes.map((cls: { id: number; name: string }) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
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


export default EventForm;
