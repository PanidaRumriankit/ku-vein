// user/[user_id]
"use client";

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import {useSession} from "next-auth/react";
import Popup from 'reactjs-popup';
import GetUserData from '../../constants/getuser';
import MakeApiRequest from "../../constants/getreview";
import ReviewCard from "../../components/reviewcard";
import {followURL, questionURL} from '../../constants/backurl';
import Image from 'next/image';
import GetBookmarks from '../../constants/getbookmarks';
import QuestionCard from '../../components/questioncard';

export default function UserProfile() {
  const router = useRouter();
  const params = useParams();
  const user_id = params.user_id;
  const [activeTab, setActiveTab] = useState('reviews');
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [bookmarkQuestion, setBookmarkQuestion] = useState([]);
  const [bookmarkReview, setBookmarkReview] = useState([]);

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
    return reviews.filter((review) => (review.username === userData.user_name && review.is_anonymous === false));
  };

  const getFilteredQuestions = () => {
    return questions.filter((question) => question.username === userData.user_name && question.anonymous === false);
  };

  const fetchBookmarkQuestions = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkQuestion(response.filter((bookmark) => bookmark.data_type === "qa"));
    // console.log('Received bookmarks questions:', bookmarkQuestion);
  };

  const fetchBookmarkReviews = async () => {
    const response = await GetBookmarks(session.email);
    setBookmarkReview(response.filter((bookmark) => bookmark.data_type === "review"));
    // console.log('Received bookmarks reviews:', bookmarkReview);
  }

  const [followers, setFollowers] = useState([]);
  const email = useMemo(() => session?.email || null, [session]);
  const idToken = useMemo(() => session?.idToken || session?.accessToken || null, [session]);

  useEffect(() => {
    if (session && user_id) {
      async function FetchData() {
        const [data, personData] = await Promise.all([
          GetUserData(user_id, "user_id"),
          GetUserData(session.email, "email"),
        ]);

        // console.log('Fetched personData:', personData);
        setPersonalData(personData);

        if (user_id == personData.id) {
          console.log('Redirecting to profile page...');
          router.push('/profile');
          return;
        }

        setUserData({
          user_id: data.id,
          user_name: data.username,
          user_type: "student",
          description: data.desc,
          profile_color: data.pf_color,
          profile_link: data.profile_link,
          follower_count: data.follower_count,
          following_count: data.following_count,
          following: data.following,
          follower: data.follower,
        });

        setLoading(false);
        setFollowerCount(data.follower_count);
        setFollowers(data.follower);
      }
      FetchData();
    }

    else if (user_id) {
      async function FetchData() {
        const data = await GetUserData(user_id, "user_id");

        setUserData({
          user_id: data.id,
          user_name: data.username,
          user_type: "student",
          description: data.desc,
          profile_color: data.pf_color,
          profile_link: data.profile_link,
          follower_count: data.follower_count,
          following_count: data.following_count,
          following: data.following,
          follower: data.follower,
        });

        setLoading(false);
        setFollowerCount(data.follower_count);
        setFollowers(data.follower);
      }
      FetchData();
      fetchReviews();
    }
  }, [session, user_id, router]);

  useEffect(() => {
    if (session && userData && personalData) {
      // Check if the user is already following the target user
      setIsFollowing(userData.follower.some(follower => follower.username === personalData.username));
      console.log('User Data:', userData);
      // console.log('Personal Data:', personalData);
      // console.log('isfollowing:', isFollowing);
    }
  }, [session, userData, personalData]);

  useEffect(() => {
    if (followers) {
      console.log('Followers:', followers);
    }
  }, [followers]);

  useEffect(() => {
    if (session) {
      fetchReviews();
      fetchQuestions();
      fetchBookmarkQuestions();
      fetchBookmarkReviews();
    }
  }, [session]);

  if (loading || !userData) return <p>Loading...</p>;
  
  async function followUser() {
    if (!email || !idToken) {
      console.log("ID Token or email is missing.");
      return;
    }

    console.log('Fetched personalData:', personalData);

    if (!personalData || !personalData.id) {
      console.log("Personal data is not loaded yet.");
      return;
    }

    try {
      const response = await fetch(followURL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${idToken}`,
          'Content-Type': 'application/json',
          "email": email,
        },
        body: JSON.stringify({
          current_user_id: String(personalData.id),
          target_user_id: String(userData.user_id),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);

        } else {
          console.log('Error:', response.status, response.statusText);
        }
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "reviews":
        const filteredReviews = getFilteredReviews();
        return (
          <div className="flex flex-col maw-w-6xl w-full space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((item, index) => {
                const isBookmarked = bookmarkReview.some(
                  (bookmark) => bookmark.object_id == item.reviews_id
                );
                return <ReviewCard item={item} key={index} bookmark={isBookmarked} />
              })
            ) : (
              <p className="text-green-400 text-center">No Reviews currently</p>
            )}
          </div>
        );
      case "posts":
        const filteredQuestions = getFilteredQuestions();
        return (
          <div className="flex flex-col maw-w-6xl w-full space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((item, index) => {
                const isBookmarked = bookmarkQuestion.some(
                  (bookmark) => bookmark.object_id === item.questions_id
                );
                return <QuestionCard item={item} key={index} bookmark={isBookmarked} page="profile" />
              })
            ) : (
              <p className="text-green-400 text-center">No Question currently</p>
            )}
          </div>
        );
      default:
        return <p>Select a section to view its content.</p>;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      {/* Profile Header */}
      <div className="w-full p-6 rounded-md text-center text-black dark:text-white relative">
        {/* Profile Background */}
        <div
          className="w-100 h-48 -mx-6"
          style={{ background: userData.profile_color }}
        ></div>

        {/* Profile Picture */}
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
          {userData.profile_link ? (
            <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden">
              <Image
                src={userData.profile_link}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                className="border-gray-500 border-2"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full border-gray-500 border-2"></div>
          )}
        </div>

        <div className="mt-16 mb-24">
          <h1 className="text-2xl font-semibold">{userData.user_name}</h1>
          <p className="text-gray-400">@{userData.user_id}</p>
          <p className="text-gray-500">{userData.description}</p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Following Count */}
            <Popup trigger={
              <div className="text-center cursor-pointer">
                <span className="block">{userData.following_count}</span>
                <span className="text-gray-500">Following</span>
              </div>
            } modal closeOnDocumentClick>
              {close => (
                <div className="h-96 w-96 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Following</h2>
                  {userData.following.length > 0 ? (
                    <ul>
                      {userData.following.map((followingUser, index) => (
                        <li
                          key={index}
                          className="py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer"
                          onClick={() => {router.push(`/user/${followingUser.follow_id}`);}}
                        >
                          <div className="flex items-center space-x-4 ml-28 transform -translate-x-1/2">
                            {/* Profile Image */}
                            {followingUser.profile_link ? (
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-500">
                                <Image
                                  src={followingUser.profile_link}
                                  alt="Profile"
                                  width={100}
                                  height={100}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-[5.5rem] h-16 rounded-full bg-gray-300 border-2 border-gray-500"></div>
                            )}

                            {/* Username and Description */}
                            <div className="flex flex-col">
                              <p className="font-medium">{followingUser.username}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{followingUser.desc}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">{`This account doesn't follow anyone.`}</p>
                  )}
                </div>
              )}
            </Popup>
            {/* Follower Count */}
            <Popup trigger={
              <div className="text-center cursor-pointer">
                <span className="block">{followerCount}</span>
                <span className="text-gray-500">Follower</span>
              </div>
            } modal closeOnDocumentClick>
              {close => (
                <div className="h-96 w-96 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Followers</h2>
                  {followers.length > 0 ? (
                    <ul>
                      {followers.map((followeredUser, index) => (
                        <li
                          key={index}
                          className="py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer"
                          onClick={() => {
                            const navigationId = followeredUser.follow_id || followeredUser.id;
                            router.push(`/user/${navigationId}`);
                          }}
                        >
                          <div className="flex items-center space-x-4 ml-28 transform -translate-x-1/2">
                            {/* Profile Image */}
                            {followeredUser.profile_link ? (
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-500">
                                <Image
                                  src={followeredUser.profile_link}
                                  alt="Profile"
                                  width={100}
                                  height={100}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-[5.5rem] h-16 rounded-full bg-gray-300 border-2 border-gray-500"></div>
                            )}

                            {/* Username and Description */}
                            <div className="flex flex-col">
                              <p className="font-medium">{followeredUser.username}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{followeredUser.desc}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">This account has no follower.</p>
                  )}
                </div>
              )}
            </Popup>
          </div>

          {/* Follow Buttons */}
          <div className="flex justify-end gap-4 -mt-40 mr-12">
            {session && (
              <button
                className={`px-8 py-2 rounded ${
                  isFollowing
                    ? 'bg-transparent text-[#44b3ab] outline outline-[#44b3ab] hover:outline-[#4ECDC4] hover:text-[#4ECDC4]'
                    : 'text-white bg-[#4ECDC4] hover:bg-[#44b3ab]'
                }`}
                onClick={() => {
                  setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
                  setFollowers((prev) => (isFollowing ? prev.filter((follower) => follower.username !== personalData.username) : [...prev, personalData]));
                  setIsFollowing((prev) => !prev);
                  followUser();
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-around w-3/4 mt-6 border-b-2 border-gray-200">
        {['Reviews', 'Posts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`relative pb-2 px-4 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full max-w-6xl mt-4 flex justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
