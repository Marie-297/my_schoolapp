import { SubjectSchema } from "./formValidateSchema";
import prisma from "./prisma";

type currentState = { success: boolean; error: boolean };

export const createStudent = async (data: any) => {
  const response = await fetch("/api/student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create student");
  }

  return response.json();
};

export const updateStudent = async (id: string, data: any) => {
  const response = await fetch(`/api/student/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update student");
  }

  return response.json();
};

export const deleteStudent = async (prevState: any, formData: FormData) => {
  const id = formData.get("id");
  console.log("Deleting student with ID:", id);
  const response = await fetch(`/api/student/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }

  return response.json();
};

export const createTeacher = async (data: any) => {
  const response = await fetch("/api/teacher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create teacher");
  }

  return response.json();
};

export const updateTeacher = async (id: string, data: any) => {
  const response = await fetch("/api/teacher", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update teacher");
  }

  return response.json();
};

export const deleteTeacher = async (prevState: any, formData: FormData) => {
  const id = formData.get('id');
  console.log("Deleting teacher with ID: " + id);
  const response = await fetch(`/api/teacher/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to delete teacher");
  }
  return response.json();
};

export const createSubject = async (data: any) => {
  console.log("Data to be sent:", data);
  const response = await fetch("/api/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create subject");
  }

  return await response.json();
};

export const updateSubject = async (id: string, data: { name: string; teachers: string[] }) => {
  const response = await fetch(`/api/subjects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response status:', response.status);
  console.log('Response body:', await response.text());

  if (!response.ok) {
    throw new Error("Failed to update subject");
  }

  return response.json();
};


export const deleteSubject = async (id: string, data: any) => {
  const response = await fetch(`/api/subjects/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to delete subject");
  }

  return response.json();
};

export const createClass = async (data: any) => {
  const response = await fetch("/api/class", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create class");
  }

  return response.json();
};

export const updateClass = async (id: string, data: any) => {
  const response = await fetch(`/api/class/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update class");
  }

  return response.json();
};


export const deleteClass = async (currentState: currentState, data: FormData) => {
  const id = data.get('id') as string;
  console.log("Details sent for delete", id, data);
  const response = await fetch(`/api/class/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to delete class");
  }

  return response.json();
};

export const createExams = async (data: any) => {
  const response = await fetch("/api/exams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create exams");
  }

  return response.json();
};

export const updateExams = async (id: string, data: any) => {
  const response = await fetch("/api/exams", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update exams");
  }

  return response.json();
};


export const deleteExams = async (currentState: currentState, data: FormData) => {
  const id = data.get('id') as string;
  console.log("Deleting exam with ID:", id);
  const response = await fetch(`/api/exams/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to delete exam");
  }

  return response.json();
};

export const createLesson = async (data: any) => {
  const response = await fetch("/api/lesson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create lesson");
  }

  return response.json();
};

export const updateLesson = async (data: any) => {
  const response = await fetch("/api/lesson/", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update lesson");
  }

  return response.json();
};


export const deleteLesson = async (currentState: currentState, data: FormData) => {
  const id = data.get('id') as string;
  console.log("Details sent for delete", id, data);
  const response = await fetch(`/api/lesson/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to delete lesson");
  }

  return response.json();
};

export const createAnnouncement = async (data: any) => {
  const response = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create Announcement");
  }

  return response.json();
};

export const updateAnnouncement = async (id: string, data: any) => {
  const response = await fetch(`/api/announcement/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update Announcement");
  }

  return response.json();
};


export const deleteAnnouncement = async (_: any, formData: FormData) => {
  const id = formData.get("id");

  if (!id) {
    return { success: false, error: "Missing ID" };
  }

  const response = await fetch(`/api/announcements?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    console.error("Failed to delete announcement");
    return { success: false, error: "Failed to delete announcement" };
  }

  return { success: true };
};


export const createEvent = async (data: any) => {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create Event");
  }

  return response.json();
};

export const updateEvent = async (id: string, data: any) => {
  const response = await fetch("/api/events", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update Event");
  }

  return response.json();
};


export const deleteEvent = async (currentState: currentState, data: FormData) => {
  const id = data.get("id") as string;
  const response = await fetch(`/api/events/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to delete Event");
  }

  return response.json();
};

export const createParent = async (data: any) => {
  const response = await fetch("/api/parent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log('Response Status:', response.status);
  const responseBody = await response.text(); 
  console.log('Response Body:', responseBody);

  if (!response.ok) {
    throw Error("Failed to create Parent");
  }

  return response.json();
};

export const updateParent = async (id: string, data: any) => {
  const response = await fetch(`api/parent/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update Parent");
  }

  return response.json();
};

export const deleteParent = async (prevState: any, formData: FormData) => {
  const id = formData.get("id");
  console.log("Deleting Parent with ID:", id);
  const response = await fetch(`/api/parent/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to delete Parent");
  }

  return response.json();
};
