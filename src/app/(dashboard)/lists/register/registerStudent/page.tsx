"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "@/components/others/InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import {
  studentSchema,
  StudentSchema,
} from "@/lib/formValidateSchema";
import {
  createStudent,
  updateStudent,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { PiStudentFill } from "react-icons/pi";

const StudentForm = ({
  type ,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const [grades, setGrades] = useState<{ id: number; level: string }[]>([]);
  const [classes, setClasses] = useState<{ id: number; level: string }[]>([]);

  const handleGradeClick = () => {
    // Dynamically generate grade levels from level1 to level9
    const generatedGrades = Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      level: `level${i + 1}`,
    }));
    setGrades(generatedGrades);
  };

  const handleClassClick = () => {
    const generatedClasses = Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      level: `class${i + 1}A`,
    }));
    setClasses(generatedClasses);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, formAction] = useActionState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      birthday: new Date(data.birthday),
      img: img?.secure_url || data?.img || null,
    };
    try {
      const response  = await fetch("/api/student", {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // return response.json();
      if (!response.ok) {
        throw new Error("Failed to create/update student");
      }
      const result = await response.json();
      toast.success(result.message || "student created successfully")
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create/update student");
      console.error(error);
    }
    console.log(payload)
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);


  return (
    <form className="flex flex-col gap-8 p-14 shadow-lg" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        Create a new student
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Password"
          name="password"
          type="text"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <CldUploadWidget
        uploadPreset="schoolapp"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              {img?.secure_url ? (
                <Image src={img.secure_url} alt="Upload Image" width={100} height={100} /> 
              ) : ( <PiStudentFill />)}
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
        />
        <InputField
          label="Parent Id"
          name="parentId"
          defaultValue={data?.parentId}
          register={register}
          error={errors.parentId}
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
            onClick={handleGradeClick}
          >
            {grades.map((grade) => (
              <option value={grade.id} key={grade.id}>
                {grade.id}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
            onClick={handleClassClick}
          >
            {classes.map(
              (classItem) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.id}
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="bg-black text-white  hover:bg-blue-300 hover:text-black transition tracking-widest duration-300 font-extrabold p-2 rounded-md">
        {isSubmitting ?  "Creating new Student": "Create Student"}
      </button>
    </form>
  );
};

export default StudentForm;