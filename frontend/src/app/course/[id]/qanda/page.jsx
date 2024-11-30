"use client" 

import {useEffect, useState} from "react";
import CourseNavigationBar from "../../../components/coursenavigation";
import QuestionCard from "../../../components/questioncard";
import {question} from "../../../constants/index";
import Sorting from "../../../components/sorting";
import AddQuestion from "../../../components/addquestion";
import GetQuestion from "../../../constants/getquestion";

export default function QuestionAndAnswerPage({params}) {
  const [questions, setQuestions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState("latest");

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await GetQuestion(selectedKeys);
      setQuestions(data);
    };
    fetchQuestions()
  }, [selectedKeys]);

  async function PostBookmark() {
    const response = await fetch(`api/book`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${idToken}`,
        'Content-Type': 'application/json',
        "email": email,
      },
      body: JSON.stringify({
        email: email,
      }),
    })
  }

  return (
    <div className="text-black flex flex-col items-center
                    min-h-screen bg-white dark:bg-black dark:text-white">
      <div className="w-full max-w-5xl justify-start">
          <CourseNavigationBar courseId={params.id}/>
          <div className="justify-end mt-4">
            <Sorting selectedKeys={selectedKeys}
                    setSelectedKeys={setSelectedKeys}/>
          </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-5xl">
        {questions.length > 0 ? (
          questions.map((item, index) => (
            <QuestionCard item={item} key={index}/>
          ))
        ) : (
          <p className="text-green-400 text-center">No Q&A currently</p>
        )}
      </div>
      <div className="fixed bottom-4 right-4 z-40">
        <AddQuestion />
      </div>
    </div>
  );
}
