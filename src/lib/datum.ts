import React from "react";

// constants/grades.js
export const grades = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
];

export const classes = [
  { label: '1A', value: '1A' },
  { label: '1B', value: '1B' },
  { label: '2A', value: '2A' },
  { label: '2B', value: '2B' },
  { label: '3A', value: '3A' },
  { label: '3B', value: '3B' },
  { label: '4A', value: '4A' },
  { label: '4B', value: '4B' },
  { label: '5A', value: '5A' },
  { label: '5B', value: '5B' },
  { label: '6A', value: '6A' },
  { label: '6B', value: '6B' },
  { label: '7A', value: '7A' },
  { label: '7B', value: '7B' },
  { label: '8A', value: '8A' },
  { label: '8B', value: '8B' },
  { label: '9A', value: '9A' },
  { label: '9B', value: '9B' },
];

// types.ts
export interface SubjectWithTeachers {
  id: number
  name: string
  teachers: { id: string; name: string; surname: string }[]
}
