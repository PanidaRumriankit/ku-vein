"use client";

import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@nextui-org/react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import {useSession} from "next-auth/react";
import React, {useEffect, useState} from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

import {reviewURL} from "../constants/backurl";
import GetUserData from "../constants/getuser";
import SearchFaculty from "../components/searchfaculty";
import {attendant, efforts, satisfaction} from "../constants";

export default function EditDelete({userName, reviewId, item}) {
  // Original const
  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession();
  const [currentUser, setCurrentUser] = useState(null);

  // Constants and uses for editing reviews
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [postData, setPostData] = useState({
    review_id: reviewId.toString(),
    course_id: item.courses_id,
    course_type: item.courses_type,
    faculty: item.faculties,
    reviews: item.review_text,
    rating: item.ratings,
    academic_year: item.year,
    pen_name: item.name,
    grade: item.grades,
    instructor: item.professor,
    effort: item.efforts,
    attendance: item.attendances,
    scoring_criteria: item.criteria,
    class_type: item.classes_type,
  })
  const [hover, setHover] = useState(-1);
  const [hoveredEffort, setHoveredEffort] = useState(3);
  const [clickedEffort, setClickedEffort] = useState(3);
  const [hoveredAttendance, setHoveredAttendance] = useState(3);
  const [clickedAttendance, setClickedAttendance] = useState(3);
  const [anonymous, setAnonymous] = useState(false);

  function GetLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${satisfaction[value]}`;
  }

  // original const and uses
  const idToken = session?.idToken || session?.accessToken;
  const email = session?.email;

  const iconClasses = "text-xl text-black flex-shrink-0 dark:text-white";
  const textClasses = "text-lg text-black dark:text-white";

  useEffect(() => {
    if (session) {
      async function FetchData() {
        const userData = await GetUserData(session.user.email, "email");
        setCurrentUser(userData.username);
      }

      FetchData().then(() => {
        console.log("Current User", currentUser)
      });
    }
  }, [currentUser, session]);

  const handleDelete = async () => {
    if (!email || !idToken || currentUser !== userName) return;

    try {
      console.log("reviewID", reviewId)
      const response = await fetch(reviewURL, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify({
          review_id: reviewId,
        })
      });

      if (response.ok) {
        console.log("Success");
        window.location.reload();
      } else {
        console.error("Error deleting:", await response.text());
      }
    } catch (error) {
      console.error("Error upvoting review:", error);
    }
  };

  const handleEditSubmit = async () => {
    if (!idToken || currentUser !== userName) return;

    try {
      console.log("Editing review ID", reviewId);
      const response = await fetch(reviewURL, {
        method: "PUT", // PUT for editing
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Successfully updated review:", result);
        window.location.reload();
      } else {
        console.error("Error editing review:", await response.text());
      }
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  const isFormValid = () => {
    const {
      review_id,
      course_id,
      reviews,
      academic_year,
      instructor,
      pen_name,
      anonymous
    } = postData;

    if (!review_id || !course_id || !reviews || !academic_year || !instructor) {
      return false;
    }

    return !(anonymous && !pen_name);

  };

  if (!session || currentUser !== userName) return;

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="light"
            isIconOnly
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
          >
            {isOpen ? <KeyboardControlKeyIcon/> : <KeyboardArrowDownIcon/>}
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded">
          <DropdownItem
            key="edit"
            startContent={<EditIcon className={iconClasses}/>}
            className={textClasses}
            onClick={() => setIsEditOpen(true)}
          >
            Edit Review
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<DeleteForeverIcon
              className={cn(iconClasses, "text-danger")}/>}
            onClick={handleDelete}
          >
            Delete Review
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/*Edit Reviews Popup (the same as add review*/}
      {/*If have time pls refactor both add review and this one*/}
      <Popup
        open={isEditOpen}
        closeOnDocumentClick
        onClose={() => setIsEditOpen(false)}
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
        <div
          className="text-black modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-xl font-semibold pb-2">แก้ไขรีวิว</h2>

          {/*faculty search*/}
          <SearchFaculty onFacultySelect={(faculty) => setPostData({
            ...postData,
            faculty: faculty.name,
          })}/>

          {/*review text*/}
          <textarea
            type="text"
            placeholder="Edit your review"
            className="w-full h-48 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
            required
            value={postData.reviews}
            onChange={(e) => setPostData({
              ...postData,
              reviews: e.target.value
            })}
          />

          {/*ratings*/}
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

          {/*efforts*/}
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

          {/*attendance*/}
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

          {/*course type*/}
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

          {/*class type*/}
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

          {/*grades*/}
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

          {/*academic year*/}
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

          {/*professor*/}
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

          {/*name and pen name*/}
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

          {/*submit button*/}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 rounded bg-[#4ECDC4] text-white hover:bg-[#44b3ab]"
              onClick={handleEditSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}