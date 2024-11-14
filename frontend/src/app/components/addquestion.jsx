"use client";

import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {reviewURL} from '../constants/backurl.js'

export default function AddReview() {
  const {data: session} = useSession();
  const [postData, setPostData] = useState({
    email: '',
    qanda_id: '',
    title: '',
    description: '',
    isBookmarked: false,
    isAnswered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    username: '',
  });

  async function AddingQuestion() {
    try {
      // create review api
      const response = await fetch(reviewURL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${idToken}`,
          'Content-Type': 'application/json',
          "email": email,
        },
        body: JSON.stringify(postData),
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

  useEffect(() => {
    if (session) {
      const email = session.email;
      setPostData((prevData) => ({ ...prevData, email }));
    }
  }, [session]);
  
  if (!session) return null;

  const idToken = session.idToken || session.accessToken;
  const email = session.email;

  return (
    <div className="fixed bottom-4 right-4">
      <Popup
        trigger={
          <button
            className="bg-[#4ECDC4] p-4 rounded-full shadow-lg text-white hover:bg-[#44b3ab]"
          >
            <AddIcon/>
          </button>
        }
        modal
        nested
        contentStyle={{border: 'none', padding: '0', background: 'none'}}
      >
        {close => (
          <div
            className="text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold pb-2">เพิ่มคำถาม</h2>
            <div className='flex flex-wrap mt-4 font-bold'>
              <input type='text'
                     placeholder='หัวข้อคำถาม'
                     className='w-full px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                     required
                     onChange={(e) => setPostData({
                       ...postData,
                       title: e.target.value
                     })}
              />
            </div>
            <textarea
              type="text"
              placeholder="เนื้อหา"
              className="w-full h-48 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
              required
              value={postData.description}
              onChange={(e) => setPostData({
                ...postData,
                description: e.target.value
              })}
            />
            <div className='flex flex-wrap mt-4 font-bold'>
              <input type='text'
                     placeholder='นามปากกา'
                     className='w-40 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                     required
                     value={postData.username}
                     onChange={(e) => setPostData({
                       ...postData,
                       username: e.target.value
                     })}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#4ECDC4] px-4 py-2 rounded text-white hover:bg-[#44b3ab]"
                onClick={() => {
                  AddingReview();
                  close();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}