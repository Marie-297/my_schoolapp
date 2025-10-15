import { z } from "zod";

export const classSchema = z.object({
  id:z.coerce.number().optional(),
  name: z.string().min(3, { message: "Subject name must be at least 3 characters long" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required" }),
  gradeId: z.coerce.number().min(1, { message: "Grade ID is required" }),
  classTeacherId:z.coerce.string().optional(),
});
export type ClassSchema = z.infer<typeof classSchema>;

export const subjectSchema = z.object({
  id:z.coerce.number().optional(),
  name: z.string().min(3, { message: "Subject name must be at least 3 characters long" }),
  teachers: z.array(z.string()),
});
export type SubjectSchema = z.infer<typeof subjectSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }).max(50, { message: "username must be at most 50 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).optional().or(z.literal("")),
  phone: z.string(),
  address:z.string(),
  name: z.string().min(1, { message: "First name is required" }),
  surname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  img: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex type is required" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  subjects: z.array(z.string()).optional(),
})
export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, { message: "username must be at least 3 characters long" }).max(50, { message: "Username must be at most 50 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).optional().or(z.literal("")),
  address:z.string(),
  name: z.string().min(1, { message: "Child's first name is required" }),
  surname: z.string().min(1, { message: "Child's last name is required" }),
  img: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex type is required" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  classId:z.coerce.number().min(1, { message: "Class is required" }),
  parentId:z.coerce.string().min(1, { message: "ParentId is required" }),
  gradeId:z.coerce.number().min(1, { message: "Grade is required" }),
})
export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startDate: z.coerce.date({ message: "Start time is required!" }),
  endDate: z.coerce.date({ message: "End time is required!" }),
  subjectId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]),
  startTime: z.string(),
  endTime: z.string(),
  classId:z.coerce.number().min(1, { message: "Class is required" }),
  teacherId:z.coerce.string().min(1, { message: "TeacherId is required" }),
  subject:  z.number().optional(),
});
export type LessonSchema = z.infer<typeof lessonSchema>;

export const announcementSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Content must be at least 10 characters"),
  class: z.string().optional(),
});
export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Content must be at least 10 characters"),
  class: z.array(z.string()).optional(),
  startDate: z.coerce.date({ message: "Start time is required!" }),
  endDate: z.coerce.date({ message: "End time is required!" }),
});
export type EventSchema = z.infer<typeof eventSchema>;