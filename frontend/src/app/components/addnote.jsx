"use client";

import {noteURL} from "../constants/backurl";
import Popup from "reactjs-popup";
import AddIcon from '@mui/icons-material/Add';
import {Button} from "@nextui-org/button"

import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useState} from "react";

export default function AddNote() {
  const [selectedFile, setSelectedFile] = useState();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const {data: session} = useSession();
  const route = useRouter();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadPDF = async () => {
    setError('');
    setMessage('');

    if (!selectedFile) {
      setError('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(noteURL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
      }

      const data = await response.json();
      setMessage(data.message || "Successfully uploaded");
      setSelectedFile(null);
      route.refresh();
    } catch (e) {
      console.error('Error pdf upload:', e);
      setError(e.message);
    }
  }

  if (!session) return null;

  return (
    <Popup trigger={
      <div className="fixed bottom-4 right-4">
        <button
          className="bg-[#4ECDC4] p-4 rounded-full shadow-lg text-white hover:bg-[#44b3ab]">
          <AddIcon/>
        </button>
      </div>}
           modal
           nested
           contentStyle={{border: 'none', padding: '0', background: 'none'}}
    >
      <div className="items-center text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <Button type="light" onClick={uploadPDF} disabled={!selectedFile} color="primary">Upload</Button>
        {error && <p className="text-red-600 font-bold">{error}</p>}
        {message && <p className="text-green-500 font-bold">{message}</p>}
      </div>
    </Popup>
  );
}
