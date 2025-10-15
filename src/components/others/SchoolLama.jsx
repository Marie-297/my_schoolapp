import Image from "next/image";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail, MdOutlinePermPhoneMsg } from "react-icons/md";

const SchoolLama = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-500 text-white py-6 md:rounded-xl mb-4">
      {/* Container */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between gap-6">
        {/* Left side: School Info */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide mb-3">
            MARIE INTERNATIONAL SCHOOL{" "}
            <span className="text-sm font-normal">(estd 2023)</span>
          </h1>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <IoLocationOutline size={20} />
              <p className="text-sm md:text-base">GE-019-4430 / BrewsnBytes</p>
            </div>

            <div className="flex items-center gap-2">
              <MdOutlineEmail size={20} />
              <p className="text-sm md:text-base">
                marieinternatioonal24@gmail.com
              </p>
            </div>

            <div className="flex items-center gap-2">
              <MdOutlinePermPhoneMsg size={20} />
              <p className="text-sm md:text-base">+233-244-555-015</p>
            </div>
          </div>
        </div>

        <div className="h-[120px] w-[120px] rounded-full bg-[url('/fotos/MIS.png')] bg-cover bg-center shadow-lg border-2 border-white dark:border-gray-700"></div>

        
      </div>
    </div>
  );
};

export default SchoolLama;
