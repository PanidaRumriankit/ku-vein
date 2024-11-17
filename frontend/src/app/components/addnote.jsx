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
  const [base64File, setBase64File] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedCourseType, setSelectedCourseType] = useState('inter');
  const [selectedFaculty, setSelectedFaculty] = useState(new Set(['คณะเกษตร']));
  const [selectedPenName, setSelectedPenName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession();
  const route = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setBase64File(reader.result.split(',')[1]);
    };

    reader.readAsDataURL(file);
  };

  const handlePenNameChange = (e) => {
    setSelectedPenName(e.target.value);
  }

  const handleChipClick = (courseTypeEng) => {
    setSelectedCourseType(courseTypeEng);
    console.log("Selected", courseTypeEng);
  };

  const handlePDFUpload = async () => {
    if (!session?.email || !(session.idToken || session.accessToken)) {
      setError('Unauthorized: Please log in first.');
      return;
    }

    if (!base64File) {
      setError('Please select a PDF file to upload.');
      return;
    }

    try {
      const response = await fetch(noteURL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${session.idToken || session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": session.email,
          "course_id": courseId,
          "faculty": Array.from(selectedFaculty)[0],
          "course_type": selectedCourseType,
          "file": base64File
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Raw Response:", responseText);
        try {
          const errorData = JSON.parse(responseText);
          setError(errorData.message || "Server responded with an error.");
        } catch (err) {
          setError("An unexpected error occurred on the server.");
        }
      } else {
        try {
          const data = JSON.parse(responseText);
          setMessage(data.message || "File uploaded successfully.");
          setSelectedFile(null);
          setBase64File(null);
          route.refresh();
        } catch (err) {
          console.error("Failed to parse response as JSON:", err);
          setMessage("Upload successful, but received an unexpected response format.");
        }
      }
    } catch (error) {
      console.error('Error during PDF upload:', error);
      setError(error.message || 'An unexpected error occurred.');
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
            <div className="flex flex-wrap">
              <p>วิชา {courseId}</p>
              <FacultyDropDown setSelectedKeys={setSelectedFaculty}
                               selectedKeys={selectedFaculty}/>
            </div>

            <div className='flex flex-wrap font-bold'>
              <h1 className='mr-12'>นามปากกา</h1>
              <input type='text'
                     placeholder='นามปากกา'
                     className='w-40 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                     onChange={handlePenNameChange}
              />
            </div>

            <div className="w-full my-5">
              <Stack direction="row" spacing={1}>
                {courseType.map((item) => (
                  <Chip
                    label={item.thai}
                    key={item.eng}
                    onClick={() => handleChipClick(item.eng)}
                    color={selectedCourseType === item.eng ? "success" : "default"}
                    className="text-black dark:text-white mt-2 w-auto"
                  />
                ))}
              </Stack>
            </div>

            <div className="flex flex-wrap w-full">
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
