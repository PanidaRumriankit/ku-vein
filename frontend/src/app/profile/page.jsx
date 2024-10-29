"use client";

import Image from 'next/image';
import { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      {/* Profile Header */}
      <div className="w-full bg-gray-100 p-6 rounded-md text-center relative">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-400"></div>
        
        {/* Profile Picture */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
          <Image
            src="/profile-pic.jpg" // Replace with user image
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full border-gray-500 border-2"
          />
        </div>

        <div className="mt-18"> {/* Adjust to move below profile pic */}
          <h1 className="text-2xl font-semibold">Username</h1>
          <p className="text-gray-600">UserID</p>
          <p className="text-gray-500">Description</p>
          <div className="flex justify-center space-x-4 mt-4">
            <span>Following</span>
            <span>Followers</span>
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
            {activeTab === tab.toLowerCase() && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* Add components for Highlights and Articles similarly */}
      </div>
    </div>
  );
};

export default Profile;
