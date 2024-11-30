"use client";

import Image from 'next/image';
import {useState, useEffect} from 'react';
import {useSession} from "next-auth/react";
import {HexColorPicker} from 'react-colorful';
import BrushIcon from '@mui/icons-material/Brush';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import GetUserData from '../constants/getuser';
import {userURL} from "../constants/backurl";
import {useTheme} from 'next-themes';
import Popup from 'reactjs-popup';
import { fetchData } from 'next-auth/client/_utils';

export default function Profile() {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState('posts');
  const {data: session} = useSession();
  const [hovered, setHovered] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [putData, setPutData] = useState(null);
  const [colorBg, setColorBg] = useState('');
  const [followingData, setFollowingData] = useState([]);
  const [followerData, setFollowerData] = useState([]);

  const handleColorClick = () => setColorPickerOpen(true);
  const closeColorPicker = () => setColorPickerOpen(false);
  const openEditDialog = () => setEditOpen(true);
  const closeEditDialog = () => setEditOpen(false);

  useEffect(() => {
    if (session) {
      async function FetchData() {
        const userData = await GetUserData(session.user.email, "email");
        console.log('userData: ', userData);
        setPutData({
          user_id: userData.id,
          user_name: userData.username,
          user_type: "student",
          email: session.email,
          description: userData.desc,
          profile_color: userData.pf_color,
          follower_count: userData.follower_count,
          following_count: userData.following_count,
          following: userData.following,
          follower: userData.follower,
        });
        setColorBg(userData.pf_color);
      }

      FetchData();
    }
  }, [session]);

  if (!session) return null;

  const idToken = session.idToken || session.accessToken;
  const email = session.email;
  const [profileImage, setProfileImage] = useState(session?.user?.image);

  async function putProfile() {
    try {
      const putDataSubset = {
        user_id: putData.user_id,
        user_name: putData.user_name,
        user_type: putData.user_type,
        email: putData.email,
        description: putData.description,
        profile_color: putData.profile_color,
      };

      const response = await fetch(userURL, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${idToken}`,
          'Content-Type': 'application/json',
          "email": email,
        },
        body: JSON.stringify(putDataSubset),
      });
      if (!email || !idToken) {
        console.log("ID Token or email is missing.");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.log('Error:', response.status, response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (!putData) return null;

  const handleFollow = () => {
    const currentUser = { username: session.user.name, desc: session.user.description || "" };
  
    const isFollowing = putData.follower.some(follower => follower.username === currentUser.username);
  
    let updatedFollowers;
  
    if (isFollowing) {
      updatedFollowers = putData.follower.filter(follower => follower.username !== currentUser.username);
    } else {
      updatedFollowers = [...putData.follower, currentUser];
    }
  
    setPutData({
      ...putData,
      follower: updatedFollowers,
    });

  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  // console.log('Patch Data:', putData);

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      {/* Profile Header */}
      <div
        className="w-full p-6 rounded-md text-center text-black dark:text-white relative">
        {/* Profile Background */}
        <div
          className="w-100 h-48 -mx-6"
          style={{background: colorBg}}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleColorClick}
        >
          {hovered && (
            <div
              className="w-full h-48 inset-0 bg-black bg-opacity-30 flex items-center justify-end pr-4 cursor-pointer">
              <BrushIcon className="text-white text-3xl mt-36"/>
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <div
          className="absolute top-40 left-1/2 transform -translate-x-1/2"
          onMouseEnter={() => setHoveredProfile(true)}
          onMouseLeave={() => setHoveredProfile(false)}
        >
          {/* Image */}
          <Image
            src={session.user.image}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full border-gray-500 border-2"
          />

          {/* Overlay */}
          {hoveredProfile && (
            <div
              className='absolute top-0 left-1/2 w-[100px] h-[100px] rounded-full flex items-center justify-center transform -translate-x-1/2 bg-black bg-opacity-50 cursor-pointer'
              onClick={handleImageClick}
            >
              <CameraAltIcon className="text-white text-3xl" />
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
          
        <div className="mt-16 mb-24">
          <h1 className="text-2xl font-semibold">{putData.user_name}</h1>
          <p className="text-gray-400">@{putData.user_id}</p>
          <p className="text-gray-500">{putData.description}</p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Following Count */}
            <Popup trigger={
              <div className="text-center cursor-pointer">
                <span className="block">{putData.following_count}</span>
                <span className="text-gray-500">Following</span>
              </div>
            } modal closeOnDocumentClick>
              {close => (
                <div className="h-96 w-96 p-4 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Following</h2>
                  {putData.following.length > 0 ? (
                    <ul>
                      {putData.following.map((followedUser, index) => (
                        <li key={index} className="py-2 border-b border-gray-300 dark:border-gray-600">
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
              <div className="text-center cursor-pointer" onClick={handleFollow}>
                <span className="block">{putData.follower_count}</span>
                <span className="text-gray-500">Follower</span>
              </div>
            } modal closeOnDocumentClick>
              {close => (
                <div className="h-96 w-96 p-4 text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h2 className="text-lg font-semibold mb-4">Followers</h2>
                  {putData.follower.length > 0 ? (
                    <ul>
                      {putData.follower.map((followeredUser, index) => (
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

          {/* Edit Profile Button */}
          <div className="flex justify-end -mt-40 mr-12">
            <button
              className="bg-[#4ECDC4] px-4 py-2 rounded text-white hover:bg-[#44b3ab]"
              onClick={openEditDialog}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Color Picker Dialog */}
      <Dialog
        open={colorPickerOpen}
        PaperProps={{
          style: {
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          },
        }}
        onClose={() => {
          putProfile();
          closeColorPicker();
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Background Color</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <HexColorPicker
              color={colorBg}
              onChange={(color) => {
                setColorBg(color);
                setPutData({...putData, profile_color: color});
              }}
              className="mx-auto"
            />
            <TextField
              fullWidth
              value={colorBg}
              onChange={(e) => {
                const newColor = e.target.value;
                setColorBg(newColor);
                setPutData({...putData, profile_color: newColor});
              }}
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
                      backgroundColor: colorBg,
                      marginRight: 8,
                    }}
                  />
                ),
                style: {
                  backgroundColor: theme === 'dark' ? '#333333' : '#ffffff',
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                },
              }}
              InputLabelProps={{
                style: {
                  color: theme === 'dark' ? '#bbbbbb' : '#000000',
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editOpen}
        onClose={closeEditDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          },
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={putData.user_name}
            onChange={(e) => setPutData({
              ...putData,
              user_name: e.target.value
            })}
            margin="normal"
            InputProps={{
              style: {
                backgroundColor: theme === 'dark' ? '#333333' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              },
            }}
            InputLabelProps={{
              style: {
                color: theme === 'dark' ? '#bbbbbb' : '#000000',
              },
            }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={putData.description}
            onChange={(e) => setPutData({
              ...putData,
              description: e.target.value
            })}
            margin="normal"
            multiline
            rows={4}
            InputProps={{
              style: {
                backgroundColor: theme === 'dark' ? '#333333' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              },
            }}
            InputLabelProps={{
              style: {
                color: theme === 'dark' ? '#bbbbbb' : '#000000',
              },
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                putProfile();
                closeEditDialog();
              }}
              className="mt-4 bg-[#4ECDC4] px-4 py-2 rounded text-white hover:bg-[#44b3ab]"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tab Navigation */}
      <div
        className="flex justify-around w-3/4 mt-6 border-b-2 border-gray-200">
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
