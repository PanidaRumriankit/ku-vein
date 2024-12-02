"use client";

import React from 'react';
import 'reactjs-popup/dist/index.css';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import { useParams } from 'next/navigation.js';
import {questionURL} from '../constants/backurl.js'

export default function AddAnswer() {
  const {data: session} = useSession();
  const params = useParams();
  const questionId = parseInt(params.qanda_id, 10);
  const [hover, setHover] = useState(-1);
  const [postData, setPostData] = useState({
    question_id: '',
    answer_text: '',
    user_id: '',
    pen_name: '',
  });

  // console.log('qID: ', questionId);

  async function AddingAnswer() {
    try {
      // create review api
      const response = await fetch(questionURL + '/answer', {
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
        window.location.reload();
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
    <div
      className="mx-auto my-4 w-[32rem] max-w-4xl bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-xl font-semibold pb-2">เพิ่มความคิดเห็น</h2>
      <textarea
        type="text"
        placeholder="ความคิดเห็น"
        className="w-full h-48 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
        required
        value={postData.description}
        onChange={(e) => setPostData({
          ...postData,
          answer_text: e.target.value
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
                  pen_name: e.target.value
                })}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-[#4ECDC4] px-4 py-2 rounded text-white hover:bg-[#44b3ab]"
          onClick={() => {
            AddingAnswer();
          }}
        >
          Submit
        </button>
      </div>
    </div>        
  );
}
