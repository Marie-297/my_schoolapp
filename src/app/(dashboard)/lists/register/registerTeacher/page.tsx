"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "@/components/others/InputField";
import Image from "next/image";
import { Dispatch,SetStateAction,useActionState, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidateSchema";
import { createTeacher, updateTeacher } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { PiChalkboardTeacherFill } from "react-icons/pi";

const TeacherFormPage = ({
  
}: {
  data?: any;
  relatedData?: any;
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subjects"); 
      const data = await res.json();
      setSubjects(Array.isArray(data.subjects) ? data.subjects : []);
    } catch (err) {
      console.error(err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }
  fetchSubjects();
}, []);


  const [img, setImg] = useState<any>();

 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      birthday: new Date(data.birthday),
      img: img?.secure_url || data?.img || null,
    };
    try {
      setIsSubmitting(true);
      const response  = await fetch("/api/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create/update teacher");
      }
      const result = await response.json();
      toast.success(result.message || "Teacher created successfully")
      reset();
      router.refresh();
    } catch (error) {
      setSubmitError("Failed to create/update teacher");
      toast.error("Failed to create/update student");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
    console.log(payload)
  });


  const router = useRouter();

  return (
    <form className="flex flex-col p-14 shadow-lg gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        Create a new teacher
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          placeholder="Username"
          // defaultValue={username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Password"
          name="password"
          type="text"
          placeholder="Password"  
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
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
                              ) : ( <PiChalkboardTeacherFill />)}
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>
        <InputField
          label="First Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address}
        />
        <InputField
          label="Birthday"
          name="birthday"
          register={register}
          error={errors.birthday}
          type="date"
        />
        <InputField
          label="Id"
          name="id"
          register={register}
          error={errors?.id}
          hidden
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
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
          <label className="text-xs text-gray-500">Subjects</label>
          {loading ? (
            <p>Loading subjects...</p>
          ) : (
            <select
              multiple
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("subjects")}
            >
              {subjects.map((subject: { id: number; name: string }) => (
                <option value={subject.id} key={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          )}
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
      </div>
      {submitError && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-black text-white hover:bg-blue-300 hover:text-black transition tracking-widest duration-300 font-extrabold p-2 rounded-md" disabled={isSubmitting}>
        {isSubmitting ?  "Creating new Teacher": "Create Teacher"}
      </button>
    </form>
  );
};

export default TeacherFormPage;