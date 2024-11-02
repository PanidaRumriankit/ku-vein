"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { HexColorPicker } from 'react-colorful';
import BrushIcon from '@mui/icons-material/Brush';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import GetUserData from '../constants/getuser';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');
  const {data: session} = useSession();
  const [hovered, setHovered] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [patchData, setPatchData] = useState(null);
  const handleColorClick = () => setColorPickerOpen(true);
  const closeColorPicker = () => setColorPickerOpen(false);

  if (!session) return null;

  useEffect(() => {
    async function fetchData() {
      const userData = await GetUserData(session.user.email);
      console.log('userData: ', userData);
      setPatchData({
        id: userData.id,
        username: userData.username,
        desc: userData.desc,
        pf_color: userData.pf_color,
      });
    }
    fetchData();
  }, [session]);

  if (!patchData) return null;
  
  console.log('Patch Data:', patchData);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      {/* Profile Header */}
      <div className="w-full p-6 rounded-md text-center text-black dark:text-white relative">
        {/* Profile Background */}
        <div
          className="w-100 h-48 -mx-6"
          style={{ background: patchData.pf_color }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleColorClick}
        >
          {hovered && (
            <div className="w-full h-48 inset-0 bg-black bg-opacity-30 flex items-center justify-end pr-4 cursor-pointer">
              <BrushIcon className="text-white text-3xl mt-36" />
            </div>
          )}

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

        <div className="mt-16"> {/* Adjusted to move below profile pic */}
          <h1 className="text-2xl font-semibold">{patchData.username}</h1>
          <p className="text-gray-600">UserID</p>
          <p className="text-gray-500">Description</p>
          <div className="flex justify-center space-x-4 mt-4">
            <span>Following</span>
            <span>Followers</span>
          </div>
        </div>
      </div>

      {/* Color Picker Dialog */}
      <Dialog open={colorPickerOpen} onClose={closeColorPicker} maxWidth="xs" fullWidth>
        <DialogTitle>Background Color</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <HexColorPicker color={patchData.pf_color} onChange={setPatchData.pf_color} className='mx-auto' />
            <TextField
              fullWidth
              value={patchData.pf_color}
              onChange={(e) => setPatchData(e.target.value)}
              variant="outlined"
              size="small"
              margin="dense"
              InputProps={{
                startAdornment: (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: patchData.pf_color,
                      marginRight: 8,
                    }}
                  />
                ),
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

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
