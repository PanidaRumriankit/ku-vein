"use client" 

import {useEffect, useState, useMemo} from "react";
import {useSession} from "next-auth/react";
import CourseNavigationBar from "../../../components/coursenavigation";
import QuestionCard from "../../../components/questioncard";
import {question} from "../../../constants/index";
import Sorting from "../../../components/sorting";
import AddQuestion from "../../../components/addquestion";
import GetQuestion from "../../../constants/getquestion";
import GetBookmarks from "../../../constants/getbookmarks";

export default function QuestionAndAnswerPage({params}) {
  const {data: session} = useSession();
  const [questions, setQuestions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState("latest");
  const [bookmarkQuestion, setBookmarkQuestion] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await GetQuestion(selectedKeys);
      setQuestions(data);
    };
    fetchQuestions()
  }, [selectedKeys]);

  const fetchBookmarks = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkQuestion(response.filter((bookmark) => bookmark.data_type === "qa"));
    console.log('Received bookmarks questions:', bookmarkQuestion);
  };

  const handleSelectedKeysChange = (keys) => {
    const selectedKey = Array.isArray(keys) ? keys[0] : [...keys][0];
    setSelectedKeys(selectedKey);
  };

  useEffect(() => {
    if (session) {
      fetchBookmarks();
    }
  }, [session]);

  return (
    <div className="text-black flex flex-col items-center
                    min-h-screen bg-white dark:bg-black dark:text-white">
      <div className="w-full max-w-5xl justify-start">
          <CourseNavigationBar courseId={params.id}/>
          <div className="justify-end mt-4">
            <Sorting selectedKeys={selectedKeys}
                     setSelectedKeys={handleSelectedKeysChange}/>
          </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-5xl">
        {questions.length > 0 ? (
          questions.map((item, index) => {
            const isBookmarked = bookmarkQuestion.some(
              (bookmark) => bookmark.object_id === item.questions_id
            );
            return <QuestionCard item={item} key={index} bookmark={isBookmarked} />
          })
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
