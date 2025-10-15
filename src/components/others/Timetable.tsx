"use client";

import React, { useState } from 'react'
import { Day, Subject } from '@prisma/client'
import { format } from 'date-fns'
import LessonForm from '../Forms/LessonForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FiEdit2 } from 'react-icons/fi';

const days: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
const timeSlots = [
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '10:30' },
  { start: '10:30', end: '11:30' },
  { start: '11:30', end: '12:30' },
  { start: '12:30', end: '13:15' },
  { start: '13:15', end: '14:15' },
  { start: '14:15', end: '15:15' },
]
const breakLabels: Record<string, string> = {
  '10:00': 'Snack Time',
  '12:30': 'Lunch Time',
}
type TimetableProps = {
  classLessons: any[]
  subjects: SubjectWithTeachers[]
  classId: number
  refreshData?: () => void
  editable?: boolean
}

type SubjectWithTeachers = {
  id: number
  name: string
  teachers: { id: string; name: string; surname: string }[]
}

function TimetablePage({ classLessons, subjects, classId, refreshData, editable }: TimetableProps) {
  const [selectedCell, setSelectedCell] = useState<null | { day: Day; starttime: string; endtime: string, classId: number, }>(null)
  const [updateSelectedCell, setUpdateSelectedCell] = useState<null | { day: Day; starttime: string; endtime: string, classId: number, subject: number, teacherId: string, id: string }>(null)
  const [isOpen, setOpen] = useState(false);
  const lessons = classLessons ?? [];
  const [mode, setMode] = useState<'create' | 'update'>('create');
  const getLesson = (day: Day, starttime: string, endtime: string, classId: number) => {
    const lesson = lessons.find(
      (lesson) =>
        lesson.dayOfWeek === day &&
        format(new Date(lesson.startTime), 'HH:mm') === starttime &&
        format(new Date(lesson.endTime), 'HH:mm') === endtime &&
        lesson.classId === classId
    );
    return lesson;
  }
  const getTeacherName = (teacherId: string) => {
    const teacher = subjects.flatMap(subject => subject.teachers).find(teacher => teacher.id === teacherId);
    return teacher ? `${teacher.name} ${teacher.surname}` : 'Unknown';
  };
  const handleCellClick = (day: Day, starttime: string, endtime: string, classId: number ) => {
    setSelectedCell({ day, starttime, endtime, classId, });
    setMode('create');
    setOpen(true);
  };
  const handleUpdateClick = (e: React.MouseEvent, day: Day, starttime: string, endtime: string, classId: number, subject: SubjectWithTeachers, teacherId: string, lessonId: string) => {
    // e.stopPropagation();
    setUpdateSelectedCell({ day, starttime, endtime, classId, subject: subject.id, teacherId , id: lessonId });
    setMode('update');
    setOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border rounded-lg border-blue-950 bg-blue-100">
        <thead>
          <tr className='text-white font-extrabold bg-blue-700'>
            <th>Day / Time</th>
            {timeSlots.map((slot, i) => {
              const isBreak =  breakLabels[slot.start]
              return (
                <th key={i} className={isBreak ? "w-6" : ""}>
                  {slot.start} - {slot.end}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {days.map((day, rowIndex) => (
            <tr key={day}>
              <td className="font-semibold pl-2 bg-yellow-400 text-blue-950 border-blue-950">{day}</td>
              {timeSlots.map((slot, colIndex) => {
               const breakLabel = breakLabels[slot.start]
              
                if (breakLabel) {
                  if (rowIndex === 0) {
                    return (
                      <td
                        key={colIndex}
                        rowSpan={days.length}
                        className="border border-blue-950 bg-yellow-100 text-yellow-800 font-bold text-center rotate-180 writing-vertical p-2"
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {breakLabel}
                      </td>
                    );
                  } else {
                    return null; // skip this cell on other rows
                  }
                }
                const lesson = getLesson(day, slot.start, slot.end,classId)
                const teacherName = lesson ? getTeacherName(lesson.teacherId) : '';
                return (
                  <td key={colIndex} className="border text-center py-2 border-blue-950">
                    {lesson ? (
                      <div className="flex items-center justify-between px-2">
                        <div className='flex flex-col'>
                          <span className='text-sm'>{lesson.subject?.name ?? 'No Subject'}</span>
                          <span className='text-[10px] italic'>{teacherName}</span>
                        </div>
                          {editable && (
                            <button
                              type="button"
                              title="Update Lesson"
                              onClick={(e) => {
                                handleUpdateClick(e, day, slot.start, slot.end, classId, lesson.subject, lesson.teacherId, lesson.id);
                              }}
                              className="ml-2 text-gray-500 hover:text-gray-800"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    ) : editable ? (
                      <span
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => handleCellClick(day, slot.start, slot.end, classId)}
                      >
                        —
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal or Dialog to Edit Lesson */}
      {isOpen && (mode === 'update' ? updateSelectedCell : selectedCell) && (
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
            <DialogTitle>{mode === 'update' ? 'update Lesson' : 'Add Lesson'}</DialogTitle>
            </DialogHeader>
            <LessonForm
              type={mode}
              data={mode === 'update' ? {
                id: updateSelectedCell?.id, 
                dayOfWeek: updateSelectedCell?.day,
                startTime: updateSelectedCell?.starttime,
                endTime: updateSelectedCell?.endtime,
                classId: updateSelectedCell?.classId,
                subject: updateSelectedCell?.subject,  
                teacherId: updateSelectedCell?.teacherId 
              } : {
                dayOfWeek: selectedCell?.day,
                startTime: selectedCell?.starttime,
                endTime: selectedCell?.endtime,
                classId: classId
              }}
              relatedData={{ subjects }}
              setOpen={setOpen}
              refreshData={refreshData ?? (() => {})}
            />
          </DialogContent>
      </Dialog>      
      )}
    </div>
  )
}


export default TimetablePage;