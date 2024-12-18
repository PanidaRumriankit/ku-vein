"use client";

import {inter} from "./fonts/fonts";
import "./globals.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import {ThemeSwitcher} from "./components/theme";
import {ThemeProvider} from 'next-themes';
import {userURL} from "./constants/backurl.js";
import UserDropdown from "./components/userdropdown";
import PersonIcon from '@mui/icons-material/Person';
import {SessionProvider, signIn, signOut, useSession} from "next-auth/react";
import {useEffect, useState} from 'react';
import Head from 'next/head';

export default function RootLayout({children}) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <RootLayoutContent>{children}</RootLayoutContent>
      </ThemeProvider>
      </body>
      </html>
    </SessionProvider>
  );
}

function RootLayoutContent({children}) {
  const {data: session, status} = useSession();
  const [error, setError] = useState(null);

  // Check for session errors
  useEffect(() => {
    if (status === 'error') {
      console.error('Session error:', session);
      setError('There was an error loading the session. Please try refreshing the page.');
    }

    if (session?.error === "AccessTokenExpired") {
      signOut();
    }
  }, [status, session]);

  // Create user in database
  useEffect(() => {
    const CreateUser = async () => {
      try {
        const response = await fetch(userURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });
    
        if (response.status === 409) {
          // 409 Conflict indicates the user already exists
          console.log('User already exists.');
          return;
        } else if (!response.ok) {
          console.error('Error creating user:', response.statusText);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    if (status === "authenticated") {
      CreateUser();
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Head>
        <title>KU Vein</title>
      </Head>
      <nav className="bg-[#4ECDC4] fixed top-0 left-0 w-full h-14 p-4 z-[9999]">
        <div
          className="container fixed mx-auto flex justify-between items-center px-10">
          <a href="/"
             className="text-white text-xl font-bold hover:text-gray-200">KU
            Vein</a>
          <ul className="flex space-x-8">
            <li><ThemeSwitcher/></li>
            {session ? (
              <>
                <li><UserDropdown/></li>
              </>
            ) : (
              <li>
                <button onClick={() => signIn('google')}
                        className="flex items-center text-white hover:text-gray-200">
                  <PersonIcon className="mr-2"/>
                  <span>Log in / Sign up</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {children}

      <footer className="bg-[#4ECDC4] p-4">
        <div
          className="container w-1/2 text-white flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} KU Vein. All rights
            reserved.</p>
          <a href="https://github.com/PanidaRumriankit/ku-vein" target="_blank"
             rel="noopener noreferrer">
            <GitHubIcon
              className="w-7 h-7 hover:text-black hover:scale-110 transition-colors duration-200"/>
          </a>
        </div>
      </footer>
    </>
  );
}