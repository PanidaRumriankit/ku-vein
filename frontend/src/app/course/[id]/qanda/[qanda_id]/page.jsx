"use client" 

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {question} from "../../../../constants/index";
import QuestionCard from "../../../../components/questioncard";
import AnswerCard from "../../../../components/answercard";
import QuestionText from "../../../../components/questiontext";
import CourseNavigationBar from "../../../../components/coursenavigation";
import Sorting from "../../../../components/sorting";
import AddAnswer from "../../../../components/addanswer";
import backurl from "../../../../constants/backurl";
import GetQuestion from "../../../../constants/getquestion";
import GetBookmarks from "../../../../constants/getbookmarks";

export default function EachQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const {data: session} = useSession();
  const questionId = parseInt(params.qanda_id, 10);
  const [selectedKeys, setSelectedKeys] = useState("latest");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [bookmarkQuestion, setBookmarkQuestion] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const question = questions.find((question) => question.questions_id === questionId);

  // console.log('questionID:', questionId);

  const fetchBookmarks = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkQuestion(response.filter((bookmark) => bookmark.data_type === "qa"));
    console.log('Received bookmarks questions:', bookmarkQuestion);
  };

  useEffect(() => {
    if (session) {
      fetchBookmarks();
    }
  }, [session]);

  useEffect(() => {
    if (bookmarkQuestion.length > 0) {
      const isBookmark = bookmarkQuestion.some((bookmark) => bookmark.object_id === questionId);
      setIsBookmarked(isBookmark);
    }
  }, [bookmarkQuestion, questionId]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(`${backurl}/qa?question_id=${questionId}&mode=${selectedKeys}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch answers: ${response.statusText}`);
        }
        const data = await response.json();
        setAnswers(data);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    fetchAnswers();
  }, [questionId, selectedKeys]);

  // console.log("QuestionText Component:", QuestionText);

  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       console.log("Fetching questions...");
  //       const response = await fetch('https://ku-vein.onrender.com/api/qa?mode=' + selectedKeys);
  //       console.log("Response received:", response);
  //       if (!response.ok) {
  //         console.error(`Failed to fetch. Status: ${response.status}`);
  //         return;
  //       }
  //       const data = await response.json();
  //       console.log("Parsed data:", data);
  //       setQuestions(data);
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   };
  
  //   fetchQuestions();
  // }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await GetQuestion(selectedKeys);
      setQuestions(data);
    };
    fetchQuestions()
  }, [selectedKeys]);

  // useEffect(() => {
  //   if (answers) {
  //     console.log('answers:', answers);
  //   }
  // })

  useEffect(() => {
    if (questions) {
      console.log('questions[questionId]:', question);
    }
  })
  
  // console.log('questions:', questions);
  // console.log('questionId:', questionId);

  // console.log('questions:', questions);

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
      {question ? (
        <QuestionText item={question} bookmark={isBookmarked}/>
      ) : (
        <p>Loading question...</p>
      )}
        <div className="flex w-1/2 justify-start font-bold my-4">
          <h1>Answers</h1>
        </div>
        {/* {answers.length > 0 ? (
          answers.map((item, index) => (
            <AnswerCard item={item} key={index}/>
          ))
        ) : (
          <p className="text-green-400 text-center">No Q&A currently</p>
        )}
        <AddAnswer /> */}
      </div>
    </div>
  );
}
