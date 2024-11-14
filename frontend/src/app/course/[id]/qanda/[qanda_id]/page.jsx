"use client" 

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {question, answer} from "../../../../constants/index";
import QuestionCard from "../../../../components/questioncard";
import AnswerCard from "../../../../components/answercard";
import QuestionText from "../../../../components/questiontext";
import CourseNavigationBar from "../../../../components/coursenavigation";
import Sorting from "../../../../components/sorting";

export default function EachQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = parseInt(params.qanda_id, 10);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [questions, setQuestions] = useState([]);

  console.log('questionID:', questionId);

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
        <QuestionText item={question[questionId - 1]}/>
        <div className="flex w-1/2 justify-start font-bold my-4">
          <h1>Answers</h1>
        </div>
        {answer.length > 0 ? (
          answer.map((item, index) => (
            <AnswerCard item={item} key={index}/>
          ))
        ) : (
          <p className="text-green-400 text-center">No Q&A currently</p>
        )}
        </div>
      </div>
  );
}
