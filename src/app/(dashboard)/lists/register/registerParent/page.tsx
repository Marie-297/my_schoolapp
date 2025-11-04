"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "@/components/others/InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import {
  parentSchema,
  ParentSchema,
} from "@/lib/formValidateSchema";
import {
  createParent,
  updateParent,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { RiParentFill } from "react-icons/ri";

const ParentForm = ({
  type ,
  data,
}: {
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const [img, setImg] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, formAction] = useActionState(
    type === "create" ? createParent : updateParent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
    };
    try {
      const response  = await fetch("/api/parent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // return response.json();
      if (!response.ok) {
        throw new Error("Failed to create parent");
      }
      const result = await response.json();
      toast.success(result.message || "parent created successfully")
      reset(); 
      setImg(undefined);
      router.refresh();
    } catch (error) {
      toast.error("Failed to create parent");
      console.error(error);
    } finally {
    setIsSubmitting(false);
    console.log(payload)
  }});

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh();
    }
  }, [state, router, type]);


  return (
    <form className="flex flex-col gap-8 p-14 shadow-lg" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        Create a new parent
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
              ) : ( <RiParentFill />)}
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
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
          type="email"
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
      </div>
      <button type="submit" disabled={isSubmitting} className="bg-black text-white  hover:bg-blue-300 hover:text-black transition tracking-widest duration-300 font-extrabold p-2 rounded-md" >
        {isSubmitting ?  "Creating new Prent": "Create Parent"}
      </button>
    </form>
  );
};

export default ParentForm;