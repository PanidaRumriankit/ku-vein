// user/[user_id]
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Popup from 'reactjs-popup';
import GetUserData from '../../constants/getuser';
import { followURL } from '../../constants/backurl';

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

  useEffect(() => {
    if (session && user_id) {
      async function FetchData() {
        const [data, personData] = await Promise.all([
          GetUserData(user_id, "user_id"),
          GetUserData(session.email, "email"),
        ]);

        console.log('Fetched personData:', personData);
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
          follower_count: data.follower_count,
          following_count: data.following_count,
          following: data.following,
          follower: data.follower,
        });

        setLoading(false);
        setFollowerCount(data.follower_count);
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
          follower_count: data.follower_count,
          following_count: data.following_count,
          following: data.following,
          follower: data.follower,
        });

        setLoading(false);
        setFollowerCount(data.follower_count);
      }
      FetchData();
    }
  }, [session, user_id, router]);

  useEffect(() => {
    if (session && userData && personalData) {
      // Check if the user is already following the target user
      setIsFollowing(userData.follower.some(follower => follower.username === personalData.username));
      // console.log('User Data:', userData);
      // console.log('Personal Data:', personalData);
      // console.log('isfollowing:', isFollowing);
    }
  }, [session, userData, personalData]);

  if (loading || !userData) return <p>Loading...</p>;

  if (session) {
    const idToken = session?.idToken || session?.accessToken;
    const email = session?.email;
  }
  
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
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gray-300 rounded-full border-gray-500 border-2"></div>

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
                <div className="h-96 w-96 p-4 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Following</h2>
                  {userData.following.length > 0 ? (
                    <ul>
                      {userData.following.map((followedUser, index) => (
                        <li
                          key={index}
                          className="py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer"
                          // onClick={() => {router.push(`/user/${user_id}`);}}
                          >
                          <p className="font-medium">{followedUser.username}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{followedUser.desc}</p>
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
                <div className="h-96 w-96 p-4 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Followers</h2>
                  {userData.follower.length > 0 ? (
                    <ul>
                      {userData.follower.map((followeredUser, index) => (
                        <li key={index} className="py-2 border-b border-gray-300 dark:border-gray-600">
                          <p className="font-medium">{followeredUser.username}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{followeredUser.desc}</p>
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
                  setIsFollowing((prev) => !prev);
                  setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
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
        {['Reviews', 'Posts', 'Replies', 'Notes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`relative pb-2 px-4 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
