"use client" 

import {useEffect, useState} from "react";
import CourseNavigationBar from "../../../components/coursenavigation";
import QuestionCard from "../../../components/questioncard";
import GetQuestion from "../../../constants/getquestion";
import {question} from "../../../constants/index";
import Sorting from "../../../components/sorting";

export default function QuestionAndAnswerPage({params}) {
  const [questions, setQuestions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));

  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     const data = await GetQuestion(courseId);
  //     setQuestions(data);
  //   };

  //   fetchQuestions();
  // }, [courseId]);

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
        {question.length > 0 ? (
          question.map((item, index) => (
            <QuestionCard item={item} key={index}/>
          ))
        ) : (
          <p className="text-green-400 text-center">No Q&A currently</p>
        )}
      </div>
    </div>
  );
}
