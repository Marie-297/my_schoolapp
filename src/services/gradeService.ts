import prisma from "@/lib/prisma";

// Function to create a grade
export const createGrade = async (level: number) => {
  return await prisma.grade.create({
    data: { level },
  });
};

// Function to create a grade with classes
export const createGradeWithClasses = async (level: number, classes: { name: string; capacity: number }[]) => {
  return await prisma.grade.create({
    data: {
      level,
      classes: { create: classes },
    },
  });
};
