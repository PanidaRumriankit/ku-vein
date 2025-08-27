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
          padding: 0,
          background: 'none',
          height: '90%',
          width: '95%',
          maxWidth: '900px',
          overflow: 'auto'
        }}
      >
        {close => (
          <div className="text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold pb-2">เพิ่มรีวิว</h2>

            <div className="space-y-4">
              <Search
                onCourseSelect={(course) =>
                  setPostData({...postData, course_id: course.courses_id})
                }
              />

              <SearchFaculty
                onFacultySelect={(faculty) =>
                  setPostData({...postData, faculty: faculty.name})
                }
              />

              <textarea
                placeholder="ความคิดเห็นต่อรายวิชา"
                className="w-full h-48 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
                required
                value={postData.reviews}
                onChange={(e) => setPostData({...postData, reviews: e.target.value})}
              />

              {/* ความพึงพอใจ */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mt-2">
                <h3 className="font-bold mb-2 md:mb-0">ความพึงพอใจ</h3>
                <div className="flex items-center">
                  <Rating
                    value={Math.max(postData.rating, 1)}
                    getLabelText={GetLabelText}
                    onChange={(event, newValue) => {
                      setPostData({...postData, rating: Math.max(newValue, 1)});
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover >= 1 ? newHover : hover);
                    }}
                    emptyIcon={<StarIcon style={{opacity: 0.55, color: 'gray'}} fontSize="inherit" />}
                  />
                  {postData.rating !== null && (
                    <div className="ml-2">
                      {satisfaction[hover !== -1 ? hover : postData.rating]}
                    </div>
                  )}
                </div>
              </div>

              {/* ความยาก */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="font-bold mb-2 md:mb-0 md:mr-12">ความยาก</h1>
                  <div className="flex flex-wrap gap-3">
                    {[1,2,3,4,5].map((effort) => (
                      <button
                        key={effort}
                        type="button"
                        className={`text-lg hover:cursor-pointer ${
                          postData.effort === effort ? 'text-[#4ECDC4]' : 'text-gray-400 hover:text-[#4ECDC4]'
                        }`}
                        onMouseEnter={() => setHoveredEffort(effort)}
                        onMouseLeave={() => setHoveredEffort(clickedEffort)}
                        onClick={() => {
                          setPostData((prev) => ({...prev, effort}));
                          setClickedEffort(effort);
                          setHoveredEffort(effort);
                        }}
                      >
                        {effort}
                      </button>
                    ))}
                  </div>
                </div>
                {hoveredEffort && (
                  <div className="mt-2 md:mt-0 md:ml-[calc(theme(spacing.12)+0rem)]">
                    <span className="font-normal">{efforts[hoveredEffort]}</span>
                  </div>
                )}
              </div>

              {/* การเช็คชื่อ */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="font-bold mb-2 md:mb-0 md:mr-10">การเช็คชื่อ</h1>
                  <div className="flex flex-wrap gap-3">
                    {[1,2,3,4,5].map((attendance) => (
                      <button
                        key={attendance}
                        type="button"
                        className={`text-lg hover:cursor-pointer ${
                          postData.attendance === attendance ? 'text-[#4ECDC4]' : 'text-gray-400 hover:text-[#4ECDC4]'
                        }`}
                        onClick={() => {
                          setPostData((prev) => ({...prev, attendance}));
                          setClickedAttendance(attendance);
                          setHoveredAttendance(attendance);
                        }}
                        onMouseEnter={() => setHoveredAttendance(attendance)}
                        onMouseLeave={() => setHoveredAttendance(clickedAttendance)}
                      >
                        {attendance}
                      </button>
                    ))}
                  </div>
                </div>
                {hoveredAttendance && (
                  <div className="mt-2 md:mt-0 md:ml-[calc(theme(spacing.10)+0rem)]">
                    <span className="font-normal">{attendant[hoveredAttendance]}</span>
                  </div>
                )}
              </div>

              {/* เรียนแบบ */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="font-bold mb-2 md:mb-0 md:mr-16">เรียนแบบ</h1>
                  <div className="flex flex-wrap gap-3">
                    {['onsite','online','hybrid'].map((type) => (
                      <button
                        key={type}
                        className={`px-4 py-2 rounded text-sm font-bold outline ${
                          postData.class_type === type
                            ? 'bg-[#44b3ab] text-white outline-[#44b3ab]'
                            : 'bg-transparent text-[#44b3ab] outline-[#44b3ab] hover:bg-[#4ECDC4] hover:text-white hover:outline-[#4ECDC4]'
                        }`}
                        onClick={() => setPostData((prev) => ({...prev, class_type: type}))}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* เกณฑ์ */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="font-bold mb-2 md:mb-0 md:mr-[5.25rem]">เกณฑ์</h1>
                  <div className="flex flex-wrap gap-3">
                    {['work-based', 'exam-based', 'project-based', 'balance'].map((criteria) => (
                      <button
                        key={criteria}
                        className={`px-4 py-2 rounded text-sm font-bold outline ${
                          postData.scoring_criteria === criteria
                            ? 'bg-[#44b3ab] text-white outline-[#44b3ab]'
                            : 'bg-transparent text-[#44b3ab] outline-[#44b3ab] hover:bg-[#4ECDC4] hover:text-white hover:outline-[#4ECDC4]'
                        }`}
                        onClick={() => setPostData((prev) => ({...prev, scoring_criteria: criteria}))}
                      >
                        {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* เกรดที่ได้ */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="font-bold mb-2 md:mb-0 md:mr-12">เกรดที่ได้</h1>
                  <div className="flex flex-wrap gap-4">
                    {['A','B+','B','C+','C','D+','D','F','W'].map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        className={`text-lg hover:cursor-pointer ${
                          postData.grade === grade ? 'text-[#4ECDC4]' : 'text-gray-400 hover:text-[#4ECDC4]'
                        }`}
                        onClick={() => setPostData((prev) => ({...prev, grade}))}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ปีการศึกษา */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="font-bold mb-2 md:mb-0 md:mr-12">ปีการศึกษา</h1>
                  <input
                    type="text"
                    placeholder="พ.ศ."
                    className="w-32 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
                    required
                    value={postData.academic_year}
                    onChange={(e) => setPostData({...postData, academic_year: e.target.value})}
                  />
                </div>
              </div>

              {/* อาจารย์ */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <h1 className="font-bold mb-2 md:mb-0 md:mr-[4.5rem]">อาจารย์</h1>
                  <input
                    type="text"
                    placeholder="อาจารย์"
                    className="w-60 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
                    required
                    value={postData.instructor}
                    onChange={(e) => setPostData({...postData, instructor: e.target.value})}
                  />
                </div>
              </div>

              {/* โพสต์แบบ */}
              <div className="mt-4">
                <div className="flex flex-col">
                  <h1 className="font-bold mb-2">โพสต์แบบ</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
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

                  {anonymous && (
                    <div className="mt-4 flex flex-col md:flex-row md:items-center">
                      <h1 className="font-bold mb-2 md:mb-0 md:mr-8">นามปากกา</h1>
                      <input
                        type="text"
                        placeholder="นามปากกา"
                        className="w-60 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
                        required
                        value={postData.pen_name}
                        onChange={(e) => setPostData({...postData, pen_name: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
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
          </div>
        )}
      </Popup>
    </div>
  );
}
