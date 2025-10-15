import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const SIGNING_SECRET = process.env.WEBHOOK_SECRET
  console.log("Signing secret:", SIGNING_SECRET)

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
  }

  // Get headers
  const headerPayload = await headers()
  console.log('Incoming headers:', headerPayload)
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json();
  console.log('Incoming payload:', payload)
  const body = JSON.stringify(payload);

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type

  if ( eventType === 'user.created' ) {
    try {
      const { first_name, last_name, username, image_url} = evt.data;

      const student = await prisma.student.create({
        data: {
          id: evt.data.id,
          name: first_name || 'Student name',
          surname: last_name || "Student surname",
          username: username || "username",
          img: image_url,
          birthday: new Date(),
          sex: "MALE",
          address: "address",
          gradeId: 1,
          classId: 1,
          parentId: "parent1",
          role: "STUDENT",
        }
      })
      console.log('User created:', student);
    } catch (err) {
      return new Response('Error: Could not create user', { status: 500 })
    }
  }
  return new Response('Webhook received', { status: 200 })
}