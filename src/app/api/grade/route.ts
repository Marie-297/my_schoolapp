import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET and POST requests for grades
export async function GET() {
  try {
    // Fetch all grades from the database
    const grades = await prisma.grade.findMany();
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { level } = await request.json();

    // Create a new grade
    const newGrade = await prisma.grade.create({
      data: { level },
    });

    return NextResponse.json(newGrade, { status: 201 });
  } catch (error) {
    console.error('Error creating grade:', error);
    return NextResponse.json({ error: 'Failed to create grade' }, { status: 500 });
  }
}
