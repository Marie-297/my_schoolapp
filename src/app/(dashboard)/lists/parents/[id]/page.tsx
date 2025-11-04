import FormContainer from "@/components/others/FormContainer";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoMdMailUnread } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { FaAddressBook } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import Image from "next/image";
import { GrFormView } from "react-icons/gr";

export default async function SingleParentPage  ({
  params,
}: { params:  Promise<{ id: string }> }) {
  const { id } = await params;
  const parentId = id;
  const user = await currentUser();
  const metadata = user?.publicMetadata;
  const role = metadata?.Value;

  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    include: {
      students: {
        select: {
          id: true,
          name: true,
          surname: true,
          class: true,
          img: true,   
          sex: true, 
          grade: true,
        },
      },
      _count: {
        select: {
          students: true,
        },
      },
    },
  });

  if (!parent) {
    return notFound();
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      <div className="w-full">
        {/* TOP */}
        <div className="flex flex-col gap-8 w-[100%]">
          <div className="flex gap-4 text-center">
            <h1 className="text-xl lg:text-4xl font-extrabold">
              {parent.name + " " + parent.surname}
            </h1>
            {role === "ADMIN" && (
              <FormContainer table="parent" type="update" data={parent} />
            )}
          </div>
          <div className="flex gap-x-8 gap-y-4 flex-wrap text-md font-medium">
            <div className="flex flex-col gap-4">
              <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                <IoMdMailUnread className="text-slate-950 w-3 h-3 lg:w-6 lg:h-6" />
                <span>{parent.email || "-"}</span>
              </div>
              <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                <FaAddressBook className="text-slate-950 w-3 h-3 lg:w-6 lg:h-6" />
                <span>{parent.address || "-"}</span>
              </div>
            </div>
            <div className="lg:flex-1 lg:gap-4 lg:flex-wrap">
              <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                <MdContactPhone className="w-3 h-3 lg:w-6 lg:h-6" />
                <span>{parent.phone || "-"}</span>
              </div>
              <div className="bg-white items-center p-1 rounded-md flex gap-2 lg:gap-4 w-full md:w-[48%]">
                <PiStudentFill className="w-3 h-3 lg:w-6 lg:h-6" />
                <h1 className="text-base font-semibold">
                  Number of Children (<span className="lg:text-sm text-[10px] text-gray-400">{parent.students.length}</span>)
                </h1>
                  
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOWN */}
      <div className="mt-6 bg-white p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Children</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Info</th>
              <th className="p-3 hidden md:table-cell">Class</th>
              <th className="p-3 hidden md:table-cell">Gender</th>
              {role === "ADMIN" && <th className="p-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {parent.students.length > 0 ? (
              parent.students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="flex items-center gap-3 p-3">
                    {student.img ? (
                      <Image
                        src={student.img}
                        alt={student.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <RxAvatar size={40} className="text-gray-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {student.name} {student.surname}
                      </p>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {student.grade.level || "-"}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {student.sex || "-"}
                  </td>
                  <div className="flex gap-4 items-center justify-center">
                    {role === "ADMIN" && (
                      <td className="p-3 flex items-center gap-2 justify-center">
                        <FormContainer
                          table="student"
                          type="delete"
                          id={student.id}
                        />
                      </td>
                    )}
                    <Link
                        href={`/lists/students/${encodeURIComponent(
                          student.id
                        )}`}
                      >
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky"
                          title="View"
                        >
                          <GrFormView size={20} />
                        </button>
                      </Link>
                    </div>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={role === "ADMIN" ? 5 : 4}
                  className="text-center p-4 text-gray-500"
                >
                  No children found for this parent.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};