/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SubjectToTeacher_AB_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_clerkId_key" ON "Admin"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_clerkId_key" ON "Parent"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_clerkId_key" ON "Student"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_clerkId_key" ON "Teacher"("clerkId");
