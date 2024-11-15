"use client";

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { useState } from "react";
import {useSession} from "next-auth/react";

export default function Home() {
  const {data: session} = useSession();
  const [selectedSection, setSelectedSection] = useState("Reviews");

  const renderContent = () => {
    switch (selectedSection) {
      case "Reviews":
        return <p>Here are your reviews!</p>;
      case "Posts":
        return <p>Here are your posts!</p>;
      case "Notes":
        return <p>Here are your notes!</p>;
      default:
        return <p>Select a section to view its content.</p>;
    }
  };

  if (!session) return null;

  const idToken = session.idToken || session.accessToken;
  const email = session.email;

  return (
    <div className="flex h-screen mt-12">
      {/* Navbar */}
      <div className="w-1/4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4">
        <Navbar className="bg-transparent">
          <NavbarContent>
            <h1 className="text-xl font-bold -ml-6">Bookmarks</h1>
          </NavbarContent>
        </Navbar>
        <ul className="space-y-4">
          <li
            className={`p-2 cursor-pointer ${
              selectedSection === "Reviews" ? "bg-blue-500 dark:text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedSection("Reviews")}
          >
            Reviews
          </li>
          <li
            className={`p-2 cursor-pointer ${
              selectedSection === "Posts" ? "bg-blue-500 dark:text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedSection("Posts")}
          >
            Posts
          </li>
          <li
            className={`p-2 cursor-pointer ${
              selectedSection === "Notes" ? "bg-blue-500 dark:text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedSection("Notes")}
          >
            Notes
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 dark:bg-black dark:text-white">
        <h1 className="text-3xl font-bold mb-4">{selectedSection}</h1>
        {renderContent()}
      </div>
    </div>
  );
}
