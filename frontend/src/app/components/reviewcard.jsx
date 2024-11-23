"use client";

import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";
import PopupProfile from "./popupprofile.jsx";

import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import {upvoteURL} from "../constants/backurl.js"
import {colorPallet, facultyColor} from "../constants";
import MakeApiRequest from '../constants/getupvotestatus';
import GetUserData from '../constants/getuser';
import EditDelete from "../components/editdelete"

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

function RandomColor() {
  const index = Math.floor(Math.random() * colorPallet.length);
  return colorPallet[index];
}

export default function ReviewCard({ item, page = null }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const color = facultyColor[item.faculties] || RandomColor();
  const [upvoteCount, setUpvoteCount] = useState(item.upvote || 0);
  const [isVoted, setIsVoted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const idToken = session?.idToken || session?.accessToken;
  const email = session?.email;

  const handleUpvote = async () => {
    if (isLoading || !email || !idToken) return;
    setIsLoading(true);

    try {
      const response = await fetch(upvoteURL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify({
          review_id: item.reviews_id,
          email: email
        })
      });

      if (response.ok) {
        setUpvoteCount(prevCount => isVoted ? prevCount - 1 : prevCount + 1);
        setIsVoted(!isVoted);
      } else {
        console.log("Error upvoting:", await response.text());
      }
    } catch (error) {
      console.error("Error upvoting review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLegendClick = () => {
    router.push(`/course/${item.courses_id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const voteStatus = await MakeApiRequest(email, item.reviews_id);
        setIsVoted(voteStatus);
      }
    };
    fetchData().then();
    setUpvoteCount(item.upvote || 0);
  }, [session, email, item]);

  useEffect(() => {
    const fetchUserId = async () => {
      const data = await GetUserData(item.username, "user_name");
      setUserId(data.id);
      console.log("User id:", data.id);
    };
    fetchUserId();
  }, [item.username]);

  useEffect(() => {
    if (userId) {
      console.log("User id2:", userId.toString(), typeof userId.toString());
    }
  }, [userId]);

  useEffect(() => {
    if (item.date) {
      const formatted = new Date(item.date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      setFormattedDate(formatted);
    }
  }, [item.date]);

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 10,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="mx-auto my-4 w-full max-w-4xl text-black dark:text-white">
      <fieldset className="border border-gray-300 rounded-md p-4">
        {page === "page" && (
          <legend
            style={{backgroundColor: color, borderColor: color}}
            className="hover: cursor-pointer p-2 border-solid border rounded text-black font-bold dark:text-white"
            onClick={handleLegendClick}
          >
            {item.courses_id} | {item.courses_name}
          </legend>
        )}
        <div className="text-black dark:text-white">
          <div className="justify-between flex">
            <Rating value={item.ratings} readOnly
                    emptyIcon={<StarIcon style={{opacity: 0.55, color: 'gray'}}/>}/>
            {item.professor &&
              <p className="text-gray-300">ผู้สอน: {item.professor}</p>}
          </div>
          <br />
          <p>{item.review_text}</p>
          <br />
          <div className="flex items-center justify-between text-gray-300 text-right">
            <p className="text-left">เกรด: {item.grades}</p>
            <p className="text-right">
              {formattedDate} โดย:{" "}
              <span
                className={!item.is_anonymous ? "cursor-pointer": ""}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  if (!item.is_anonymous) {
                    router.push(`/user/${userId}`);}
                  }}
              >
                {item.username}
              </span>
              {!item.is_anonymous && isHovered && (
                <div
                  style={{
                    position: "absolute",
                    top: popupPosition.y,
                    left: popupPosition.x,
                    width: "14vw",
                    height: "8vw",
                    zIndex: 1000,
                    border: "1px solid #ccc",
                    background: theme === 'dark' ? '#000' : '#fff',
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <PopupProfile userId={userId.toString()}/>
                </div>
              )}
            </p>
          </div>
          <hr/>
          <div className="text-gray-300 flex justify-between mt-2">
            <div className="text-left">
              <Button variant="light" onClick={handleUpvote}
                      disabled={!session || isLoading}>
                <ThumbUpTwoToneIcon color={isVoted ? "primary" : ""} /> {upvoteCount}
              </Button>
            </div>
            <div className="text-right">
              <ReportButton/>
              <ShareButton/>
              <EditDelete userMail={email} reviewId={item.reviews_id}/>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
