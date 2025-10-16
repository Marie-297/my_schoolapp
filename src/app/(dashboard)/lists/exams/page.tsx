import React from 'react'
import FormContainer from '@/components/others/FormContainer'
import TableSearch from '@/components/others/TableSearch'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function MidtermPage ({
 searchParams,
}: { searchParams?: any }) {
  const user = await currentUser();
  console.log(user);
  const metadata = user?.publicMetadata;
  console.log(metadata);
  const role = metadata?.Value; 
  console.log(`Role ${role}`);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">MIDTERM</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
          <Link href="/lists/exams/timestable" className="block border rounded-lg px-10 py-20 shadow-sm hover:shadow-2xl transition">
            Exam Timetable
          </Link>

          <Link href="/lists/exams/exam" className="block border rounded-lg px-10 py-20 shadow-sm hover:shadow-2xl transition">
            EXAMS
          </Link>

          <Link href="/lists/exams/result" className="block border rounded-lg px-10 py-20 shadow-sm hover:shadow-2xl transition">
            EXAMS RESULTS
          </Link>
        </div>
      </div>
    </div>
  )
}