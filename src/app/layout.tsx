
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'My School App/Website',
//   description: 'Seamless School Management System for Efficient School Operations',
// }

export default function RootLayout({
  children,
 }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* <ClerkLoading>
            <div className='flex items-center justify-center h-screen text-2xl'>Loading...</div>
          </ClerkLoading>
          <ClerkLoaded>  
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
              {children}
            </SignedIn>
          </ClerkLoaded> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  )}