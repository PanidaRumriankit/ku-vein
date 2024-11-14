"use client";

import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Search from './search';
import Rating from '@mui/material/Rating';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {reviewURL} from '../constants/backurl.js'
import StarIcon from '@mui/icons-material/Star';

export default function AddReview() {
  const {data: session} = useSession();
  const [hover, setHover] = useState(-1);
  const [postData, setPostData] = useState({
    email: '',
    course_id: '',
    course_type: 'inter',
    faculty: '',
    reviews: '',
    rating: 3,
    grade: 'C',
    academic_year: new Date().getFullYear() + 543,
    pen_name: '',
    instructor: '',
  });

  const labels = {
    1: 'Very dissatisfied',
    2: 'Dissatisfied',
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very satisfied',
  };

  async function AddingReview() {
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

  function GetLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
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
            <h2 className="text-xl font-semibold pb-2">เพิ่มรีวิว</h2>
            <Search onCourseSelect={(course) => setPostData({
              ...postData,
              course_id: course.courses_id,
              faculty: course.faculty,
            }) } />
            <textarea
              type="text"
              placeholder="ความคิดเห็นต่อรายวิชา"
              className="w-full h-48 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
              required
              value={postData.reviews}
              onChange={(e) => setPostData({
                ...postData,
                reviews: e.target.value
              })}
            />
            <div className="flex justify-start">
              <h3 className="mr-12 font-bold">ความพึงพอใจ</h3>
              <Rating
                value={postData.rating}
                getLabelText={GetLabelText}
                onChange={(event, newValue) => {
                  setPostData({...postData, rating: newValue});
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{opacity: 0.55, color: 'gray'}}
                                     fontSize="inherit"/>}
              />
              {postData.rating !== null && (
                <div
                  className='ml-2'>{labels[hover !== -1 ? hover : postData.rating]}</div>
              )}
            </div>
            <div className="flex flex-wrap mt-4 font-bold">
              <h1 className="mr-12">เกรดที่ได้</h1>
              {['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W'].map((grade) => (
                <h1
                  key={grade}
                  className={`ml-4 text-lg hover:cursor-pointer ${
                    postData.grade === grade ? 'text-[#4ECDC4]' : 'text-gray-400 hover:text-[#4ECDC4]'
                  }`}
                  onClick={() => setPostData((prevData) => ({
                    ...prevData,
                    grade
                  }))}
                >
                  {grade}
                </h1>
              ))}
            </div>
            <div className='flex flex-wrap mt-4 font-bold'>
              <h1 className='mr-12'>ปีการศึกษา</h1>
              <input type='text'
                     placeholder='พ.ศ.'
                     className='w-20 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                     required
                     value={postData.academic_year}
                     onChange={(e) => setPostData({
                       ...postData,
                       academic_year: e.target.value
                     })}
              />
            </div>
            <div className='flex flex-wrap mt-4 font-bold'>
              <h1 className='mr-18'>อาจารย์</h1>
              <input type='text'
                     placeholder='อาจารย์'
                     className='w-40 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2'
                     required
                     value={postData.instructor}
                     onChange={(e) => setPostData({
                       ...postData,
                       instructor: e.target.value
                     })}
              />
            </div>
            <div className='flex flex-wrap mt-4 font-bold'>
              <h1 className='mr-12'>นามปากกา</h1>
              <input type='text'
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