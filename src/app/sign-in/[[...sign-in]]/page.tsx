"use client"

import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server';
import { useSearchParams } from 'next/navigation'
import { useUser } from "@clerk/nextjs";
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Page() {
  const searchParams = useSearchParams()
  const [role, setRole] = useState("student");
  console.log("role:", role)
  
  useEffect(() => {
    const storedRole = localStorage.getItem("selectedRole");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  const bgImage = {
    admin: '/fotos/admin.png',
    teacher: '/fotos/teacher.png',
    student: '/fotos/students.png',
    parent: '/fotos/parent.png'
  }[role] || '/fotos/student.png'
  
  return (
    <div className='relative h-screen w-full md:overflow-hidden'>
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
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center h-full w-ful px-0 md:px-[360px]">
        <div className='relative w-full lg:w-1/2 md:h-[70%] h-[30%] md:rounded-l-xl shadow-2xl backdrop-blur-sm md:border-r-2 md:border-gray-300 border-none bg-white'>
          <Image
            src={bgImage}
            alt={`${role} background`}
            fill
            className='object-contain object-center md:rounded-l-xl'
            quality={90}
          />
        </div>
        <div className='w-full md:w-1/2 md:h-[70%] h-[70%] md:rounded-r-xl border-none mr-0'>
          <div className="w-full h-full flex justify-center items-center">
            <SignIn
              afterSignOutUrl={"/"}
              appearance={{
                elements: {
                  card: 'bg-white md:rounded-r-xl !max-w-full w-full h-full p-8 border-none border-gray-200 w-full',
                  headerTitle: 'text-2xl font-bold text-center text-gray-800',
                  headerSubtitle: 'text-sm text-gray-500 text-center mb-2',
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                  socialButtonsBlockButton:
                    'bg-gray-100 hover:bg-gray-200 text-gray-800',
                },
                variables: {
                  colorPrimary: '#2563EB',
                  borderRadius: '0px',
                  fontSize: '16px',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}