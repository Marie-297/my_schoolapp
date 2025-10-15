"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import "./globals.css";
import Flag from 'react-world-flags';
import Image from 'next/image';

const RoleSelection = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  const validRoles = ["admin", "teacher", "student", "parent"];

  const navigateToDashboard = () => {
    if (!validRoles.includes(selectedRole)) {
      alert("Please select a valid role from the list.");
      return;
    }
    console.log(`Navigating to /${selectedRole}`);
    localStorage.setItem("selectedRole", selectedRole);
    router.push(`/sign-in?role=${selectedRole}&redirect=/${selectedRole}`);

  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  return (
    // <div className='flex flex-col lg:flex-row justify-center h-screen overflow-hidden'>
    //   <div className='w-[50%] h-screen flex flex-col shadow-2xl'>
    //     <div className='relative flex-[1] w-full'>
    //       <Image src="/fotos/bg-1.avif" fill style={{ objectFit: 'cover' }} alt='bg' />
    //     </div>
    //     <div className='flex-[2] w-full'>
    //       <div className='flex gap-10 justify-center mt-20'>
    //         <Flag code="gh" style={{ width: 64, height: 40 }} />
    //         <Flag code="GB" style={{ width: 64, height: 40 }} />
    //       </div>
    //     </div>
    //      <div className='relative flex-[1] w-full'>
    //       <Image src="/fotos/bg-1.avif" fill style={{ objectFit: 'cover' }} alt='bg' />
    //     </div>
    //   </div>
    //   <div className="role-selection-container min-h-screen flex justify-center items-center flex-col bg-[url('/fotos/bg-1.avif')] shadow-2xl w-[50%]">
    //     <h2 className='mb-4 text-white font-2xl font-extrabold'>Please Select Your Role</h2>
    //     <input
    //       id='role-input'
    //       type="text"
    //       list="role-options"
    //       placeholder="Log In As ..."
    //       onChange={(e) => handleRoleSelection(e.target.value)}
    //       className="role-input p-4"
    //     />
    //     <datalist id="role-options">
    //     {validRoles.map((role) => (
    //         <option key={role} value={role} />
    //       ))}
    //     </datalist>
    //     <button
    //       onClick={navigateToDashboard}
    //       className="mt-4 px-4 py-2 bg-black rounded text-white font-extrabold"
    //     >
    //       Proceed
    //     </button>
    //   </div>
    // </div>
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/fotos/bg-1.avif"
          alt="background"
          fill
          className="object-cover object-center"
          quality={90}
          priority
        />
        <div className="absolute inset-0 backdrop-blur-md bg-black/20" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center h-full px-0 lg:px-32">
        {/* Left "Page" */}
        <div
          className="w-full lg:w-1/2 md:h-[80%] h-[40%] bg-[url('/fotos/MIS.png')] bg-cover bg-center bg-no-repeat bg-white/80 dark:bg-black/60 md:rounded-l-xl shadow-2xl p-8 md:ml-4 ml-0 backdrop-blur-sm md:border-r-2 md:border-gray-300 border-none"
        >
         <h2 className="hidden md:block text-4xl font-bold text-left text-blue-900 mb-6">Welcome</h2>
          <div className="flex justify-center h-[110%] items-end md:h-[90%] gap-6">
            <Flag code="gh" style={{ width: 64, height: 40 }} />
            <Flag code="GB" style={{ width: 64, height: 40 }} />
          </div>
        </div>

        {/* Right "Page" */}
        <div className="w-full lg:w-1/2 md:h-[80%] h-[60%] bg-white/80 dark:bg-black/60 md:rounded-r-xl border-none shadow-2xl p-8 md:mr-4 mr-0 backdrop-blur-sm flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center text-blue-900 dark:text-white mb-6">Please Select Your Role</h2>
          <select
            value={selectedRole}
            title='role'
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-4 w-72 rounded-md border border-gray-300 text-black"
          >
            <option  value="" disabled>Select a role...</option>
              {validRoles.map(role => (
                <option key={role} value={role} className='flex flex-col gap-2'>
                  {role}
                </option>
              ))}
            <option/>
          </select>
          <button
            onClick={navigateToDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
