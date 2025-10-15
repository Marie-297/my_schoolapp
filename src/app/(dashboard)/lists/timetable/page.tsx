'use client'

import { useEffect, useState } from 'react'
import TimetablePage from '@/components/others/Timetable'
import { SubjectWithTeachers } from '@/lib/datum'

interface Lesson {
  id: string
  subject: SubjectWithTeachers
  teacher: { name: string }
  dayOfWeek: string
  startTime: string
  endTime: string
  classId: number
}

interface ClassData {
  id: number
  name: string
  lessons: Lesson[]
}

export default function AllClassTimetables() {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<ClassData[]>([])
  const [subjects, setSubjects] = useState<SubjectWithTeachers[]>([])

  const fetchData = async () => {
    try {
      const classResponse = await fetch('/api/class')
      const classesData = await classResponse.json()
      const subjectsResponse = await fetch('/api/subjects') 
      const subjectsData = await subjectsResponse.json()
      const subjectsArray = subjectsData?.subjects || []
      setClasses(classesData)
      setSubjects(subjectsArray)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false) 
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <p>Loading timetables...</p>

  return (
    <div className="space-y-10">
      {classes.map((cls) => (
        <div key={cls.id}>
          <h2 className="text-2xl font-bold mb-4">{cls.name} Timetable</h2>
          <TimetablePage classLessons={cls.lessons} subjects={subjects} classId={cls.id} refreshData={fetchData} editable={true} />
        </div>
      ))}
    </div>
  )
}
