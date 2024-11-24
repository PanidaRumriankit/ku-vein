"use client";

import CourseNavigationBar from "../../../components/coursenavigation";
import AddNote from "../../../components/addnote"
import NoteBox from "../../../components/notebox";
import MakeNoteApiRequest from "../../../constants/getnote";

import {useEffect, useState} from "react";

export default function NotePage({params}) {
  const [note, setNote] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await MakeNoteApiRequest(params.id);
      setNote(data);
    };

    fetchReviews().then(() => {
      console.log("Fetch note success")
    });
  }, [params.id]);

  return (
    <div className="text-black flex flex-col min-h-screen bg-white
    dark:bg-black dark:text-white">

      <div className="w-full max-w-5xl">
        <div className="justify-start">
          <CourseNavigationBar courseId={params.id}/>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        {note.length > 0 ? (
          note.map((data, index) => (
            <NoteBox data={data} key={index}/>
          ))
        ) : (
          <p className="text-green-400 text-center text-3xl">
            ขณะนี้ไม่มีสรุปของวิชา {params.id}
          </p>
        )}
      </div>
      <div className="text-success flex flex-col justify-end">
        <AddNote courseId={params.id}/>
      </div>
    </div>
  );
}