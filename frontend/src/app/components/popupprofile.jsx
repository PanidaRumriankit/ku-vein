"use client";

import {useEffect, useState} from 'react';
import GetUserData from '../constants/getuser';

export default function PopupProfile({userId}) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function FetchData() {
      try {
        const data = await GetUserData(userId, "user_id");
        console.log('Fetched data:', data);
        console.log('Fetched userId:', userId);
        if (data) {
          setUserData({
            user_id: data.id,
            user_name: data.username,
            description: data.desc,
            profile_color: data.pf_color,
          });
        } else {
          console.error("No data returned from GetUserData");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    FetchData();
  }, [userId]);

  useEffect(() => {
    if (userData) {
      console.log('Popup:', userData);
    }
  }, [userData]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center bg-white dark:bg-black text-black dark:text-white">
      {/* Profile Header */}
      <div className="w-full rounded-md text-center relative">
        {/* Profile Background */}
        <div
          className="w-50 h-12"
          style={{ background: userData.profile_color }}
        ></div>
        {/* Profile Picture */}
        <div className="absolute -my-6 ml-8 text-left transform -translate-x-1/2 w-12 h-12 bg-gray-300 rounded-full border-gray-500 border-2"></div>
        {/* Profile Information */}
        <div className="mt-7">
          <div className="flex items-center ml-2 space-x-2">
            <h1 className="text-xs font-semibold">{userData.user_name}</h1>
            <p className="text-xs text-gray-400">@{userData.user_id}</p>
          </div>
          <p className="text-left mt-0.5 ml-2 text-xs text-gray-500">{userData.description}</p>
        </div>
      </div>
    </div>
  );
}
