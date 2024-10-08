import { inter } from "./fonts/fonts";
import "./globals.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import ContrastIcon from '@mui/icons-material/Contrast';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <nav className="bg-[#4ECDC4] p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-white text-xl font-bold">KU Vein</a>
            <ul className="flex space-x-6">
              <li><ContrastIcon className="w-7 h-7 text-gray-200 hover:text-black" /></li>
              <li><NotificationsIcon className="w-7 h-7 text-gray-200 hover:text-black" /></li>
              <li><PersonIcon className="w-7 h-7 text-gray-200 hover:text-black" /></li>
            </ul>
          </div>
        </nav>
        {children}
        <footer className="bg-[#4ECDC4] p-4">
          <div className="container mx-auto text-white flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} KU Vein. All rights reserved.</p>
            <a href="https://github.com/PanidaRumriankit/ku-vein" target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="w-6 h-6 hover:text-black hover:scale-110 transition-colors duration-200" />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
