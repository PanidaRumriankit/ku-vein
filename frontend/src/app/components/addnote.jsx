"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import {Button} from "@nextui-org/button";
import Popup from "reactjs-popup";

import {noteURL} from "../constants/backurl";
import {courseType} from "../constants";
import FacultyDropDown from "../components/facultydropdown";

import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useState} from "react";

export default function AddNote({courseId}) {
  const [selectedFile, setSelectedFile] = useState();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedCourseType, setSelectedCourseType] = useState('inter');
  const [selectedFaculty, setSelectedFaculty] = useState(new Set(['คณะเกษตร']));
  const [selectedPenName, setSelectedPenName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession();
  const route = useRouter();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePenNameChange = (e) => {
    setSelectedPenName(e.target.value);
  }

  const handleChipClick = (courseTypeEng) => {
    setSelectedCourseType(courseTypeEng);
    console.log("Selected", courseTypeEng);
  };

  const handlePDFUpload = async () => {
    if (!session?.email || !(session.idToken || session.accessToken)) return;
    const email = session.email;
    console.log("email", email);
    console.log("course id", courseId, typeof courseId);
    console.log("faculty", Array.from(selectedFaculty)[0], typeof Array.from(selectedFaculty)[0]);
    console.log("courseType", selectedCourseType, typeof selectedCourseType);
    console.log("file", selectedFile, typeof selectedFile);

    setError('');
    setMessage('');

    if (!selectedFile) {
      setError('Please select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append("email", session.email);
    formData.append("courseId", courseId);
    formData.append("faculty", Array.from(selectedFaculty)[0]);
    formData.append("file", selectedFile);

    try {
      const response = await fetch(noteURL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${session.idToken || session.accessToken}`,
          'Content-Type': 'application/json',
          "email": session.email,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error", error);
      } else {
        const data = await response.json();
        setMessage(data.message || "Successfully uploaded");
        setSelectedFile(null);
        route.refresh();
      }
    } catch (e) {
      console.error('Error pdf upload:', e);
      setError(e.message);
    }
  };

  if (!session) return null;

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50"></div>
      )}

      <Popup
        trigger={
          <div className="fixed bottom-4 right-4 z-50">
            <button
              className="bg-[#4ECDC4] p-4 rounded-full shadow-lg text-white hover:bg-[#44b3ab]"
              onClick={() => setIsOpen(true)}
            >
              <AddIcon/>
            </button>
          </div>
        }
        modal
        nested
        contentStyle={{
          border: 'none', padding: '0',
          background: 'none'
        }}
        onClose={() => setIsOpen(false)} // Close modal
      >
        <div
          className="text-black modal bg-white dark:bg-gray-600 dark:text-white p-6 rounded-lg shadow-lg border border-gray-300 z-30"
        >
          <p>id {courseId}</p>
          <div className='flex flex-wrap mt-4 font-bold mb-5'>
            <h1 className='mr-12'>นามปากกา</h1>
            <input type='text'
                   placeholder='นามปากกา'
                   className='w-40 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                   onChange={handlePenNameChange}
            />
          </div>
          <div className="w-full flex">
            <Stack direction="row" spacing={1}>
              {courseType.map((item) => (
                <Chip
                  label={item.thai}
                  key={item.eng}
                  onClick={() => handleChipClick(item.eng)}
                  color={selectedCourseType === item.eng ? "success" : "default"}
                  className="text-black dark:text-white mt-2 w-70 left-0"
                />
              ))}
            </Stack>
            <FacultyDropDown setSelectedKeys={setSelectedFaculty}
                             selectedKeys={selectedFaculty}
                             className="w-30 right-0"/>
          </div>

          <div className="flex w-full">
            <input type="file" accept="application/pdf"
                   onChange={handleFileChange}
                   className="w-70 justify-start"/>
            <Button
              type="light"
              onClick={handlePDFUpload}
              disabled={!selectedFile}
              color="primary"
              className="w-30 justify-end"
            >
              Upload
            </Button>
          </div>

          {error && <p className="text-red-600 font-bold">{error}</p>}
          {message && <p className="text-green-500 font-bold">{message}</p>}
        </div>
      </Popup>
    </div>
  );
}
