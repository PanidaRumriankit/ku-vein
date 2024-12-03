"use client";

import React from 'react';
import 'reactjs-popup/dist/index.css';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import { useParams } from 'next/navigation.js';
import {questionURL} from '../constants/backurl.js'
import GetUser from '../constants/getuser';

export default function AddAnswer() {
  const {data: session} = useSession();
  const params = useParams();
  const questionId = parseInt(params.qanda_id, 10);
  const [anonymous, setAnonymous] = useState(false);
  const [postData, setPostData] = useState({
    question_id: questionId.toString(),
    answer_text: '',
    user_id: '',
    pen_name: '',
  });

  // console.log('qID: ', questionId);

  const fetchUser = async () => {
    const response = await GetUser(email, "email");
    setPostData((prevData) => ({ ...prevData, user_id: String(response.id) }));
  };

  useEffect(() => {
    if (session) {
      fetchUser();
    }
  }, [session]);

  const isFormValid = () => {
    const {
      answer_text,
      user_id,
      pen_name,
    } = postData;
    if (!answer_text || !user_id) {
      return false;
    }
    return !(anonymous && !pen_name);
  };

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
        value={postData.answer_text}
        onChange={(e) => setPostData({
          ...postData,
          answer_text: e.target.value
        })}
      />
      <div className='flex flex-wrap mt-4 font-bold'>
        <h1 className='mr-14'>โพสต์แบบ</h1>
        <div className="flex flex-col">
          <div className="flex items-center space-x-4">
            {/* ระบุตัวตน Option */}
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="identity"
                value="ระบุตัวตน"
                checked={anonymous === false}
                onClick={() => setAnonymous(false)}
                className="form-radio text-[#4ECDC4]"
              />
              <span>ระบุตัวตน</span>
            </label>
            {/* ไม่ระบุตัวตน Option */}
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="identity"
                value="ไม่ระบุตัวตน"
                checked={anonymous === true}
                onClick={() => setAnonymous(true)}
                className="form-radio text-[#4ECDC4]"
              />
              <span>ไม่ระบุตัวตน</span>
            </label>
          </div>
          {/* Input field for ไม่ระบุตัวตน */}
          {anonymous && (
            <div className='flex flex-wrap mt-4'>
              <h1 className='mr-8'>นามปากกา</h1>
              <input
                type='text'
                placeholder='นามปากกา'
                className='w-40 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                required
                value={postData.pen_name}
                onChange={(e) => setPostData({
                  ...postData,
                  pen_name: e.target.value
                })}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 rounded text-white ${
            isFormValid() ? 'bg-[#4ECDC4] hover:bg-[#44b3ab]' : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={() => {
            AddingAnswer();
            close();
          }}
        >
          Submit
        </button>
      </div>
    </div>        
  );
}
