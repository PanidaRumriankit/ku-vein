"use client";

import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

import {noteURL} from "../constants/backurl";
import GetUserData from "../constants/getuser";

const pdfDataExample = {
  courses_id: "1",
  courses_name: "Wow",
  faculties: "engineering",
  courses_type: "inter",
  u_id: 1,
  name: "yes",
  is_anonymous: true,
  pdf_name: "string.pdf",
  pdf_path: "/abc/string.pdf",
};

export default function NoteBox({userName, data}) {
  const pdfName = data['pdf_name'];
  const pdfURL = data['pdf_url'];
  const {data: session} = useSession();
  const [currentUser, setCurrentUser] = useState(null);

  const idToken = session?.idToken || session?.accessToken;
  const email = session?.email;

  useEffect(() => {
    if (session) {
      async function FetchData() {
        const userData = await GetUserData(session.user.email, "email");
        setCurrentUser(userData.username);
      }

      FetchData().then(() => {
        console.log("Current User", currentUser)
      });
    }
  }, [currentUser, session]);

  const handleDeleteNote = async () => {
    if (!email || !idToken || currentUser !== userName) return;

    try {
      console.log("noteId", data.u_id)
      const response = await fetch(noteURL, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify({
          note_id: data.u_id,
        })
      });

      if (response.ok) {
        console.log("Delete Success");
        window.location.reload();
      } else {
        console.error("Error deleting:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="mx-auto my-4 w-full max-w-4xl border p-4 rounded-md shadow-md bg-white dark:bg-gray-700">
      <p><strong>{data.faculties}</strong></p>
      <p><strong>หลักสูตร:</strong> {data.courses_type}</p>
      <p><strong>
        โดย:</strong> {data.name} ({data.is_anonymous ? "Anonymous" : "Public"})
      </p>
      <p><strong>ชื่อไฟล์:</strong> {pdfName}</p>

      <div className="flex gap-4 mt-4">
        <a
          href={pdfURL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          <VisibilityIcon/> PDF
        </a>

        <p
          className="px-4 py-2 bg-red-500 text-white rounded-md
          shadow hover:bg-red-600 hover:cursor-pointer"
          onClick={handleDeleteNote}
        >
          <DeleteForeverIcon/> PDF
        </p>
      </div>
    </div>
  )
}