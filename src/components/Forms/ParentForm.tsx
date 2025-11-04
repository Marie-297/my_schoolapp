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
  setOpen,
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

  const onSubmit = handleSubmit(async (formdata) => {
    const payload = {
      ...formdata,
      ...(type === "update" && { id: data?.id }),
    };
    console.log("PAYLOAD", payload)
    try {
      const response  = await fetch("/api/parent", {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create/update Parent");
      }
      const result = await response.json();
      toast.success(result.message || "Parent created successfully")
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create/update Parent");
      console.error(error);
    }
    console.log(payload)
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);


  return (
    <form className="flex flex-col gap-8 p-14 shadow-lg" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Parent" : "Update the Parent"}
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
      <button type="submit" className="bg-black text-white  hover:bg-blue-300 hover:text-black transition tracking-widest duration-300 font-extrabold p-2 rounded-md">
        {isSubmitting ? (type === "update" ? "Updating Parent" : "Creating new Parent") 
        : (type === "create" ? "Create Parent" : "Update Parent")}
      </button>
    </form>
  );
};

export default ParentForm;