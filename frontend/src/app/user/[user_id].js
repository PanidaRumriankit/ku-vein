// pages/user/[user_id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { HexColorPicker } from 'react-colorful';
import BrushIcon from '@mui/icons-material/Brush';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import GetUserData from '../constants/getuser';
import { useTheme } from 'next-themes';

export default function UserProfile() {
  const router = useRouter();
  const { user_id } = router.query;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user_id) {
      // Fetch user data based on user_id
      fetch(`/api/user/${user_id}`)
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [user_id]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{userData.name}'s Profile</h1>
      <p>Email: {userData.email}</p>
      <p>About: {userData.about}</p>
      {/* Render other user details as needed */}
    </div>
  );
}
