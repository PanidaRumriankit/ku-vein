"use client" 

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {question, answer} from "../../../../constants/index";
import QuestionCard from "../../../../components/qandacard";

export default function EachQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.qanda_id;
  const [questions, setQuestions] = useState([]);

  console.log('params:', params.id);

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

      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl">
          {question.length > 0 ? (
            question.map((item, index) => (
              <QuestionCard item={item} key={index}/>
            ))
          ) : (
            <p className="text-green-400 text-center">No Q&A currently</p>
          )}
        </div>
      </div>
    </div>
  );
}
