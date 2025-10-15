// prisma/seed.ts
import { Gender, PrismaClient } from '@prisma/client';
import { Day } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  //Adding Admin
  await prisma.admin.create({
    data: {
      id: 'admin1',
      username: 'admin1',
    },
  });
  await prisma.admin.create({
    data: {
      id: 'admin2',
      username: 'admin2',
    },
  })

   // Adding Grade
  for (let i = 1; i <= 9; i++) {
     await prisma.grade.create({
       data: {
         level: i,
       },
     });
   }
 
   // Adding Subject
   const AllSubject = [
     {name: "ENGLISH"},
     {name: "MATHEMATICS"},
     {name: "SCIENCE"},
     {name: "HISTORY"},
     {name: "ASANTE TWI"},
     {name: "FRENCH"},
     {name: "CREATIVE ART"},
     {name: "RME"},
     {name: "COMPUTING"},
     {name: "OWOP"}
   ]
 
   for (const subject of AllSubject)
  await prisma.subject.create({
     data: subject
   });

   const sections: Record<string, number[]> = {
    "Lower Primary": [ 1, 2, 3 ],
    "Upper Primary": [4, 5, 6],
    JHS: [7, 8, 9],
  };
   // Adding Class
   const subjects = await prisma.subject.findMany();
   for (let i = 1; i <= 9; i++) {
    await prisma.class.create({
      data: {
        name: `Class ${i}A`,
        gradeId: i,
        capacity: 20,
        subjects: {
          connect: subjects.map((s) => ({ id: s.id })), 
        },
      },
    });
   }
 
 

   //Adding Teacher
  for (let i = 1; i <= 18; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TeacherName ${i}`,
        surname: `TeacherSurname ${i}`,
        email: `teacher${i}@email.com`,
        phone: `233-000-000-000${i}`,
        sex: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        address: `Address ${i}`,
        subjects: { connect: { id: (i % 10) + 1 } },
        classes: { connect: { id: (i % 9) + 1 } },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }

  // Adding Lesson
  for (let j = 1; j <= 30; j++) {
    await prisma.lesson.create({
      data: {
        name: `subject ${j}`,
        dayOfWeek: Day[
          Object.keys(Day)[Math.floor(Math.random() * Object.keys(Day).length)] as keyof typeof Day
        ],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        subjectId: (j % 10) + 1, 
        classId: (j % 9) + 1,
        teacherId:`teacher${(j % 18) + 1}`
      },
    })
  }

  // Adding Parent
  for (let i = 1; i <= 40; i++) {
    await prisma.parent.create({
      data: {
        id: `parent${i}`,
        username: `parent${i}`,
        name: `ParentName ${i}`,
        surname: `ParentSurname ${i}`,
        email: `parent${i}@email.com`,
        phone: `233-000-000-000${i}`,
        address: `Address ${i}`,
      },
    });
  }

  // Adding Student
  for (let i = 1; i <= 80; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: `StudentName ${i}`,
        surname: `StudentSurname ${i}`,
        sex: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        address: `Address ${i}`,
        parentId: `parent${Math.ceil(i / 2) % 40 || 40}`,
        gradeId: (i % 9) + 1,	
        classId: (i % 9) + 1,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });
  }
  const allSubjects = await prisma.subject.findMany();
  for (const [sectionName, grades] of Object.entries(sections)) {
  for (const gradeId of grades) {
    // Get all classes for that grade
    const classes = await prisma.class.findMany({ where: { gradeId } });

    for (const cls of classes) {
      for (const subject of allSubjects) {
        // Create an exam for each subject in each class of that section
        await prisma.exams.create({
          data: {
            title: `${sectionName} Exam - ${subject.name} - ${cls.name}`,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            subjectId: subject.id,
          },
        });

        // Create a midterm for each subject in each class of that section
        await prisma.midTerm.create({
          data: {
            title: `${sectionName} Midterm - ${subject.name} - ${cls.name}`,
            startDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            subjectId: subject.id,
          },
        });
      }
    }
  }
}

  // Result
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        marks: 90,
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { midtermId: i - 5 }),
      },
    });
  }

  // Event
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Event ${i} description`,
        startDate: new Date(new Date().setHours(new Date().getHours () + 1)),
        endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
      }
    });
  }

  //Annoucement
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Announcement ${i} description`,
        date: new Date(),
        classId:(i % 8) + 1,
        parentId:`parent${(i % 39) + 1}`,
      }
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(), 
        present: true, 
        studentId: `student${i}`, 
        lessonId: (i % 30) + 1, 
      },
    });
  }  

  console.log("seed added successfully");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });