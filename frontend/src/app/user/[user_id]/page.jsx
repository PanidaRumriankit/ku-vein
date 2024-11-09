// user/[user_id]/page.jsx
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import GetUserData from '../../constants/getuser';

export default function UserProfile() {
  const params = useParams();
  const user_id = params.user_id;
  const [activeTab, setActiveTab] = useState('reviews');
  const { data: session } = useSession();
  const [userData, setUserData] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentID, setCurrentID] = useState(null);

  useEffect(() => {
    if (session && user_id) {
        async function fetchData() {
          const data = await GetUserData(user_id, "user_id");
          const personalData = await GetUserData(session.email, "email");
          setCurrentID(personalData.id);
          console.log('userData: ', data);
          setUserData({
            user_id: data.id,
            user_name: data.username,
            user_type: "student",
            email: session.email,
            description: data.desc,
            profile_color: data.pf_color,
            follower_count: data.follower_count,
            following_count: data.following_count,
            following: data.following,
            follower: data.follower,
          });
        }
        fetchData();
      }
    }
  , [session, user_id, currentID]);

  if (!session) return null;

  useEffect(() => {
    if (userData && currentID && Array.isArray(userData.follower)) {
      setIsFollowing(userData.follower.includes(currentID));
    }
  }, [userData, currentID]);

  const idToken = session.idToken || session.accessToken;
  const email = session.email;

  async function followUser() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/follow", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${idToken}`,
          'Content-Type': 'application/json',
          "email": email,
        },
        body: JSON.stringify({
          current_user_id: String(currentID),
          target_user_id: String(userData.user_id),
        }),
      });
      if (!email || !idToken) {
        console.log("ID Token or email is missing.");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        setIsFollowing(!isFollowing);
      } else {
        console.log('Error:', response.status, response.text());
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      {/* Profile Header */}
      <div className="w-full p-6 rounded-md text-center text-black dark:text-white relative">
        {/* Profile Background */}
        <div
          className="w-100 h-48 -mx-6"
          style={{ background: userData.profile_color }}
        >
        </div>

        {/* Profile Picture */}
        {session?.user?.image ? (
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
            <Image
              src={session.user.image}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full border-gray-500 border-2"
            />
          </div>
        ) : (
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gray-300 rounded-full border-gray-500 border-2"></div> // Placeholder if no image
        )}

        <div className="mt-16 mb-24">
          <h1 className="text-2xl font-semibold">{userData.user_name}</h1>
          <p className="text-gray-400">@{userData.user_id}</p>
          <p className="text-gray-500">{userData.description}</p>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="text-center">
              <span className="block">{userData.following_count}</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="text-center">
              <span className="block">{userData.follower_count}</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>

          {/* Follow and Edit Profile Buttons */}
          <div className="flex justify-end gap-4 -mt-40 mr-12">
            {/* Follow Button */}
            <button
              className={`px-8 py-2 rounded text-white ${
                isFollowing ? 'bg-transparent text-[#4ECDC4] outline outline-[#4ECDC4] hover:outline-[#44b3ab] hover:text-[#44b3ab]' : 'bg-[#4ECDC4] hover:bg-[#44b3ab]'
              }`}
              onClick={followUser}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>

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
