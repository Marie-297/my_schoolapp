/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `MidTerm` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `_StudentToSubject` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dueDate` to the `MidTerm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_classId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToSubject" DROP CONSTRAINT "_StudentToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToSubject" DROP CONSTRAINT "_StudentToSubject_B_fkey";

-- DropIndex
DROP INDEX "Teacher_address_key";

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "classId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teacherId",
ADD COLUMN     "classTeacherId" TEXT;

-- AlterTable
ALTER TABLE "MidTerm" DROP COLUMN "endDate",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "createdAt",
DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_StudentToSubject";

-- CreateTable
CREATE TABLE "_SubjectToTeacher" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToTeacher_AB_unique" ON "_SubjectToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectToTeacher_B_index" ON "_SubjectToTeacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_phone_key" ON "Teacher"("phone");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
