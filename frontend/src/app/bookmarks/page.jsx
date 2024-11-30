"use client";

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { useEffect, useState } from "react";
import {useSession} from "next-auth/react";
import GetBookmarks from "../constants/getbookmarks";
import MakeApiRequest from "../constants/getreview";
import ReviewCard from "../components/reviewcard";

export default function Home() {
  const {data: session} = useSession();
  const [selectedSection, setSelectedSection] = useState("Reviews");
  const [reviews, setReviews] = useState([]);
  const [bookmarkReview, setBookmarkReview] = useState([]);
  const [bookmarkPost, setBookmarkPost] = useState([]);
  const [bookmarkNote, setBookmarkNote] = useState([]);

  const fetchBookmarks = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkReview(response.filter((bookmark) => bookmark.data_type === "review"));
    setBookmarkPost(response.filter((bookmark) => bookmark.data_type === "qa"));
    setBookmarkNote(response.filter((bookmark) => bookmark.data_type === "note"));
    console.log('Received bookmarks review:', bookmarkReview);
  }

  const fetchReviews = async () => {
    setReviews(await MakeApiRequest('latest'));
  };

  const getFilteredReviews = () => {
    const bookmarkedReviewIds = bookmarkReview.map((bookmark) => bookmark.object_id);
    return reviews.filter((review) => bookmarkedReviewIds.includes(review.reviews_id));
  };

  useEffect(() => {
    if (session) {
      fetchBookmarks();
      fetchReviews();
    }
  }, [session]);

  const renderContent = () => {
    switch (selectedSection) {
      case "Reviews":
        const filteredReviews = getFilteredReviews();
        return (
          <>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((item, index) => (
                <ReviewCard item={item} key={index} page={"page"} />
              ))
            ) : (
              <p className="text-green-400 text-center">No review currently</p>
            )}
          </>
        );
      case "Posts":
        return <p>Here are your posts!</p>;
      case "Notes":
        return <p>Here are your notes!</p>;
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
          <li
            className={`p-2 cursor-pointer ${
              selectedSection === "Notes" ? "bg-blue-300 dark:bg-blue-500 dark:text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700"
            }`}
            onClick={() => setSelectedSection("Notes")}
          >
            Notes
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
