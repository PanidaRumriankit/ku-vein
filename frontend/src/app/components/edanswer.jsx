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

import GetUserData from "../constants/getuser";
import SearchFaculty from "../components/searchfaculty";
import { questionURL } from "../constants/backurl";

export default function EditDelete({userName, answerId, item}) {
  // Original const
  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession();
  const [currentUser, setCurrentUser] = useState(null);

  // Constants and uses for editing reviews
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [postData, setPostData] = useState({
    answer_id: answerId,
    answer_text: item.text,
    pen_name: item.pen_names,
  })
  const [anonymous, setAnonymous] = useState(false);
  const answerURL = questionURL + '/answer';

  const isFormValid = () => {
    const {
      answer_text,
      pen_name,
      answer_id
    } = postData;
    if (!answer_text || !answer_id) {
      return false;
    }
    return !(anonymous && !pen_name);
  };

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
      // console.log("reviewID", questionId)
      const response = await fetch(answerURL, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify({
          answer_id: answerId,
        })
      });

      if (response.ok) {
        console.log("Success");
        window.location.reload();
      } else {
        console.error("Error deleting:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEditSubmit = async () => {
    if (!idToken || currentUser !== userName) return;

    try {
      // console.log("Editing review ID", questionId);
      const response = await fetch(answerURL, {
        method: "PUT", // PUT for editing
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
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
            แก้ไขคำถาม
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<DeleteForeverIcon
              className={cn(iconClasses, "text-danger")}/>}
            onClick={handleDelete}
          >
            ลบคำถาม
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
            <h2 className="text-xl font-semibold pb-2">เพิ่มคำถาม</h2>
            <Search onCourseSelect={(course) => setPostData({
              ...postData,
              course_id: course.courses_id,
            })}/>
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
                  handleEditSubmit();
                  close();
                }}
              >
                Submit
              </button>
            </div>
          </div>
      </Popup>
    </>
  );
}