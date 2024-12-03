"use client";

import React, {useEffect, useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Search from './search';
import SearchFaculty from './searchfaculty';
import Rating from '@mui/material/Rating';
import {useSession} from 'next-auth/react';
import {reviewURL} from '../constants/backurl.js'
import StarIcon from '@mui/icons-material/Star';
import {attendant, efforts, satisfaction} from "../constants";

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
    effort: 3,
    attendance: 3,
    scoring_criteria: 'work-based',
    class_type: 'onsite',
  });
  const [hoveredEffort, setHoveredEffort] = useState(3);
  const [clickedEffort, setClickedEffort] = useState(3);
  const [hoveredAttendance, setHoveredAttendance] = useState(3);
  const [clickedAttendance, setClickedAttendance] = useState(3);
  const [anonymous, setAnonymous] = useState(false);

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
        const rs = await response.json();
        console.log('Success:', rs);
        window.location.reload();
      } else {
        console.log('Error:', response.status, response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function GetLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${satisfaction[value]}`;
  }

  useEffect(() => {
    if (session) {
      const email = session.email;
      setPostData((prevData) => ({...prevData, email}));
    }
  }, [session]);

  if (!session) return null;

  const idToken = session.idToken || session.accessToken;
  const email = session.email;

  const isFormValid = () => {
    const {
      email,
      course_id,
      reviews,
      academic_year,
      instructor,
      pen_name,
      scoring_criteria,
      attendance,
      effort,
      class_type,
    } = postData;

    if (!email || !course_id || !reviews || !academic_year || !instructor || !scoring_criteria || !attendance || !effort || !class_type) {
      return false;
    }
    return !(anonymous && !pen_name);
  };

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
        contentStyle={{
          border: 'none',
          padding: '0',
          background: 'none',
          height: '90%',
          width: '60%',
          overflow: 'auto'
        }}
      >
        {close => (
          <div
            className="text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold pb-2">เพิ่มรีวิว</h2>
            <Search onCourseSelect={(course) => setPostData({
              ...postData,
              course_id: course.courses_id,
            })}/>
            <SearchFaculty onFacultySelect={(faculty) => setPostData({
              ...postData,
              faculty: faculty.name,
            })}/>
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
                value={Math.max(postData.rating, 1)}
                getLabelText={GetLabelText}
                onChange={(event, newValue) => {
                  setPostData({...postData, rating: Math.max(newValue, 1)});
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover >= 1 ? newHover : hover);
                }}
                emptyIcon={<StarIcon style={{opacity: 0.55, color: 'gray'}}
                                     fontSize="inherit"/>}
              />
              {postData.rating !== null && (
                <div
                  className='ml-2'>{satisfaction[hover !== -1 ? hover : postData.rating]}</div>
              )}
            </div>
            <div className="flex flex-wrap mt-4 font-bold items-center">
              <h1 className="mr-[3rem]">ความยาก</h1>
              {[1, 2, 3, 4, 5].map((effort) => (
                <h1
                  key={effort}
                  className={`ml-4 text-lg hover:cursor-pointer ${
                    postData.effort === effort ? 'text-[#4ECDC4]' : 'text-gray-400 hover:text-[#4ECDC4]'
                  }`}
                  onMouseEnter={() => setHoveredEffort(effort)}
                  onMouseLeave={() => setHoveredEffort(clickedEffort)}
                  onClick={() => {
                    setPostData((prevData) => ({
                      ...prevData,
                      effort
                    }));
                    setClickedEffort(effort);
                    setHoveredEffort(effort);
                  }}
                >
                  {effort}
                </h1>
              ))}
              {hoveredEffort && (
                <span className="ml-4 font-normal">
                    {efforts[hoveredEffort]}
                  </span>
              )}
            </div>
            <div className="flex flex-wrap mt-4 font-bold items-center">
              <h1 className="mr-10">การเช็คชื่อ</h1>
              {[1, 2, 3, 4, 5].map((attendance) => (
                <h1
                  key={attendance}
                  className={`ml-4 text-lg hover:cursor-pointer ${
                    postData.attendance === attendance ? 'text-[#4ECDC4]' : 'text-gray-400 hover:text-[#4ECDC4]'
                  }`}
                  onClick={() => {
                    setPostData((prevData) => ({
                      ...prevData,
                      attendance
                    }));
                    setClickedAttendance(attendance);
                    setHoveredAttendance(attendance);
                  }}
                  onMouseEnter={() => setHoveredAttendance(attendance)}
                  onMouseLeave={() => setHoveredAttendance(clickedAttendance)}
                >
                  {attendance}
                </h1>
              ))}
              {hoveredAttendance && (
                <span className="ml-4 font-normal">
                    {attendant[hoveredAttendance]}
                  </span>
              )}
            </div>
            <div className="flex flex-wrap mt-4 font-bold">
              <h1 className="mr-16">เรียนแบบ</h1>
              {['onsite', 'online', 'hybrid'].map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 mr-4 rounded text-sm font-bold outline ${
                    postData.class_type === type
                      ? 'bg-[#44b3ab] text-white outline-[#44b3ab]'
                      : 'bg-transparent text-[#44b3ab] outline-[#44b3ab] hover:bg-[#4ECDC4] hover:text-white hover:outline-[#4ECDC4]'
                  }`}
                  onClick={() =>
                    setPostData((prevData) => ({
                      ...prevData,
                      class_type: type,
                    }))
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap mt-4 font-bold">
              <h1 className="mr-[5.25rem]">เกณฑ์</h1>
              {['work-based', 'exam-based', 'project-based', 'balance'].map((criteria) => (
                <button
                  key={criteria}
                  className={`px-4 py-2 mr-4 rounded text-sm font-bold outline ${
                    postData.scoring_criteria === criteria
                      ? 'bg-[#44b3ab] text-white outline-[#44b3ab]'
                      : 'bg-transparent text-[#44b3ab] outline-[#44b3ab] hover:bg-[#4ECDC4] hover:text-white hover:outline-[#4ECDC4]'
                  }`}
                  onClick={() =>
                    setPostData((prevData) => ({
                      ...prevData,
                      scoring_criteria: criteria,
                    }))
                  }
                >
                  {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                </button>
              ))}
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
              <h1 className='mr-[4.5rem]'>อาจารย์</h1>
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
                disabled={!isFormValid()}
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