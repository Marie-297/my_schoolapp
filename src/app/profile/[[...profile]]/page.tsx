import { UserProfile } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const Profile = async() => {
  const { userId } = await auth();
  const isAuth = !!userId;
  const user = await currentUser();

  if(!isAuth) {
    redirect('/sign-in');
  }
  console.log(user);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl'>{user?.username}</h1>
      <UserProfile />
    </div>
  )
}

export default Profile;