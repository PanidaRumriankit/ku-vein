"use client";

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { useEffect, useState } from "react";
import {useSession} from "next-auth/react";
import GetBookmarks from "../constants/getbookmarks";
import MakeApiRequest from "../constants/getreview";
import ReviewCard from "../components/reviewcard";
import QuestionCard from "../components/questioncard";
import {questionURL} from "../constants/backurl";

export default function Home() {
  const {data: session} = useSession();
  const [selectedSection, setSelectedSection] = useState("Reviews");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [bookmarkReview, setBookmarkReview] = useState([]);
  const [bookmarkPost, setBookmarkPost] = useState([]);

  const fetchBookmarks = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkReview(response.filter((bookmark) => bookmark.data_type === "review"));
    setBookmarkPost(response.filter((bookmark) => bookmark.data_type === "qa"));
    // console.log('Received bookmarks review:', bookmarkReview);
  }

  const fetchReviews = async () => {
    setReviews(await MakeApiRequest('latest'));
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(questionURL + '?mode=latest');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const getFilteredReviews = () => {
    const bookmarkedReviewIds = bookmarkReview.map((bookmark) => bookmark.object_id);
    // console.log('Bookmarked review ids:', bookmarkedReviewIds);
    return reviews.filter((review) => bookmarkedReviewIds.includes(review.reviews_id));
  };

  const getFilteredQuestions = () => {
    const bookmarkedPostIds = bookmarkPost.map((bookmark) => bookmark.object_id);
    // console.log('Bookmarked post ids:', bookmarkedPostIds);
    return questions.filter((question) => bookmarkedPostIds.includes(question.questions_id));
  };

  // console.log('Bookmark post:', bookmarkPost);
  // console.log("Questions:", questions);
  useEffect(() => {
    if (session) {
      fetchBookmarks();
      fetchReviews();
      fetchQuestions();
    }
  }, [session]);

  const renderContent = () => {
    switch (selectedSection) {
      case "Reviews":
        const filteredReviews = getFilteredReviews();
        // console.log('Filtered reviews:', filteredReviews);
        return (
          <>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((item, index) => (
                <ReviewCard item={item} key={index} bookmark={true} />
              ))
            ) : (
              <p className="text-green-400 text-center">No review currently</p>
            )}
          </>
        );
      case "Posts":
        const filteredQuestions = getFilteredQuestions();
        // console.log('Filtered questions:', filteredQuestions);
        return (
          <>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((item, index) => (
                <QuestionCard item={item} key={index} bookmark={true} page="bookmarks" />
              ))
            ) : (
              <p className="text-green-400 text-center">No Q&A currently</p>
            )}
          </>
        );
        return <p>No Q&A currently</p>;
      default:
        return <p>Select a section to view its content.</p>;
    }
  };

  if (!session) return null;

  return (
    <div className="flex h-screen mt-12">
      {/* Navbar */}
      <div className="w-1/4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4">
        <Navbar className="bg-transparent">
          <NavbarContent>
            <h1 className="text-xl font-bold -ml-6">Bookmarks</h1>
          </NavbarContent>
        </Navbar>
        <ul className="space-y-4">
          <li
            className={`p-2 cursor-pointer ${
              selectedSection === "Reviews" ? "bg-blue-300 dark:bg-blue-500 dark:text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedSection("Reviews")}
          >
            Reviews
          </li>
          <li
            className={`p-2 cursor-pointer ${
              selectedSection === "Posts" ? "bg-blue-300 dark:bg-blue-500 dark:text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedSection("Posts")}
          >
            Posts
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 dark:bg-black dark:text-white">
        <h1 className="text-3xl font-bold mb-4">{selectedSection}</h1>
        {renderContent()}
      </div>
    </div>
  );
}
