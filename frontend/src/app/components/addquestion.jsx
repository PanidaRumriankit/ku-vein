"use client";

import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {questionURL} from '../constants/backurl.js'
import GetUser from '../constants/getuser';
import Search from './search';
import SearchFaculty from './searchfaculty';

export default function AddQuestion({courseId}) {
  const {data: session} = useSession();
  const [postData, setPostData] = useState({
    user_id: '',
    question_title: '',
    question_text: '',
    faculty: '',
    course_id: courseId,
    course_type: 'inter',
    pen_name: '',
  });
  const [anonymous, setAnonymous] = useState(false);

  const fetchUser = async () => {
    const response = await GetUser(email, "email");
    setPostData((prevData) => ({ ...prevData, user_id: String(response.id) }));
  };

  const isFormValid = () => {
    const {
      question_title,
      question_text,
      faculty,
      pen_name,
    } = postData;
    if (!question_title || !question_text || !faculty) {
      return false;
    }
    return !(anonymous && !pen_name);
  };

  console.log(courseId);

  async function AddingQuestion() {
    try {
      const response = await fetch(questionURL, {
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
      fetchUser();
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
            {/* <Search onCourseSelect={(course) => setPostData({
              ...postData,
              course_id: course.courses_id,
            })}/> */}
            <SearchFaculty onFacultySelect={(faculty) => setPostData({
              ...postData,
              faculty: faculty.name,
            })}/>
            <div className='flex flex-wrap mt-4 font-bold'>
              <input type='text'
                     placeholder='หัวข้อคำถาม'
                     className='w-full px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                     required
                     onChange={(e) => setPostData({
                       ...postData,
                       question_title: e.target.value
                     })}
              />
            </div>
            <textarea
              type="text"
              placeholder="เนื้อหา"
              className="w-full h-48 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
              required
              value={postData.question_text}
              onChange={(e) => setPostData({
                ...postData,
                question_text: e.target.value
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
                  AddingQuestion();
                  close();
                  // window.location.reload();
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