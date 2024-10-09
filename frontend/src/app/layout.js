import { inter } from "./fonts/fonts";
import "./globals.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { ThemeSwitcher } from "./components/theme";
import { ThemeProvider } from 'next-themes'


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <nav className="bg-[#4ECDC4] p-4">
            <div className="container mx-auto flex justify-between items-center">
              <a href="/" className="text-white text-xl font-bold hover:text-gray-200">KU Vein</a>
              <ul className="flex space-x-6">
                <li><ThemeSwitcher /></li>
                <li><NotificationsIcon className="w-7 h-7 text-gray-200 hover:text-black hover:cursor-pointer" /></li>
                <li><PersonIcon className="w-7 h-7 text-gray-200 hover:text-black hover:cursor-pointer" /></li>
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
