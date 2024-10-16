"use client";

import { inter } from "./fonts/fonts";
import "./globals.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import { ThemeSwitcher } from "./components/theme";
import { ThemeProvider } from 'next-themes';
import UserDropdown from "./components/userdropdown";
import NotificationDropdown from "./components/notidropdown";
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import { SessionProvider, useSession, signIn } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </SessionProvider>
  );
}

function RootLayoutContent({ children }) {
  const { data: session } = useSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <nav className="bg-[#4ECDC4] p-4">
            <div className="container mx-auto flex justify-between items-center px-10">
              <a href="/" className="text-white text-xl font-bold hover:text-gray-200">KU Vein</a>
              <ul className="flex space-x-8">
                <li><ThemeSwitcher /></li>
                {session ? (
                  <>
                    <li><NotificationDropdown /></li>
                    <li><UserDropdown /></li>
                  </>
                ) : (
                  <li>
                    <button onClick={() => signIn('google')} className="flex items-center text-white hover:text-gray-200">
                      <PersonIcon className="mr-2" />
                      <span>Log in / Sign up</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </nav>
          {children}
          <footer className="bg-[#4ECDC4] p-4">
            <div className="container mx-auto text-white flex justify-between items-center">
              <p>&copy; {new Date().getFullYear()} KU Vein. All rights reserved.</p>
              <a href="https://github.com/PanidaRumriankit/ku-vein" target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="w-7 h-7 hover:text-black hover:scale-110 transition-colors duration-200" />
              </a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
