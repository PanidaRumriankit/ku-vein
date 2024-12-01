"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from '@mui/material/Checkbox';
import {Button} from "@nextui-org/button";
import Popup from "reactjs-popup";

import {noteURL} from "../constants/backurl";
import {courseType} from "../constants";
import FacultyDropDown from "../components/facultydropdown";

import {useSession} from "next-auth/react";
import {useState} from "react";

export default function AddNote({courseId}) {
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [base64File, setBase64File] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [selectedCourseType, setSelectedCourseType] = useState('inter');

  const [selectedFaculty, setSelectedFaculty] = useState(new Set(['คณะเกษตร']));

  const [selectedPenName, setSelectedPenName] = useState('');
  const [isPenName, setIsPenName] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.warn("No file selected.");
      return;
    }

    setSelectedFile(file);
    const fileName = file.name.replace(/\.pdf$/i, '');
    setSelectedFileName(fileName);

    const reader = new FileReader();
    reader.onload = () => {
      setBase64File(reader.result.split(',')[1]);
    };

    reader.readAsDataURL(file);
  };

  const handlePenNameChange = (e) => {
    setSelectedPenName(e.target.value);
  }

  const handleIsPenNameChange = () => {
    setIsPenName(!isPenName);
    if (isPenName) {
      console.log("Pen name state", isPenName);
      setSelectedPenName("");
    }
  }

  const handleChipClick = (courseTypeEng) => {
    setSelectedCourseType(courseTypeEng);
    console.log("Selected", courseTypeEng);
  };

  const handlePDFUpload = async () => {
    setError("");
    setMessage("");

    if (!session?.email || !(session.idToken || session.accessToken)) {
      setError('Unauthorized: Please log in first.');
      return;
    }

    if (!selectedFile) {
      setError("No file selected for upload.");
      return;
    }

    if (!base64File) {
      setError("Failed to process the selected file. Please try again.");
      return;
    }
    console.log("POST Data",
      "\nemail:", session.email,
      "\ncourse_id:", courseId,
      "\nfaculty:", Array.from(selectedFaculty)[0],
      "\ncourse_type:", selectedCourseType,
      "\nfile:", base64File,
      "\nfile_name", selectedFileName,
      "\npen_name:", selectedPenName || "",);

    try {
      const response = await fetch(noteURL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${session.idToken || session.accessToken}`,
          "Content-Type": "application/json",
          "email": session.email,
        },
        body: JSON.stringify({
          email: session.email,
          course_id: courseId,
          faculty: Array.from(selectedFaculty)[0],
          course_type: selectedCourseType,
          file: base64File,
          file_name: selectedFileName,
          pen_name: selectedPenName || "",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error", response.status, errorText);
        setError("Unable to send a file please use pdf format file less than 20MB");
      } else {
        const data = await response.json();
        console.log('Success:', data);
        window.location.reload();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

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
                   value={selectedPenName}
                   disabled={!isPenName}
            />
            <Checkbox checked={isPenName}
                      onChange={handleIsPenNameChange}/>
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
              color={selectedFile ? "primary": "default"}
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
