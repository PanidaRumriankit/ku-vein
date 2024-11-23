"use client";

import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";
import {colorPallet} from "../constants";
import PopupProfile from "./popupprofile.jsx";

import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

function RandomColor() {
  const index = Math.floor(Math.random() * colorPallet.length);
  return colorPallet[index];
}

export default function ReviewCard({ item, page = null }) {
  const router = useRouter();
  const { theme } = useTheme();
  const color = RandomColor();
  const [upvoteCount, setUpvoteCount] = useState(item.upvote || 0);
  const [isVoted, setIsVoted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);

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

  const handleLegendClick = () => {
    router.push(`/course/${item.courses_id}`);
  };

  const onProfileClick = () => {
    router.push(`/user/1`);
  };

  return (
    <div className="mx-auto my-4 w-full max-w-4xl text-black dark:text-white">
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
        <div>
          <div className="flex justify-between items-center">
            <Rating
              value={item.ratings}
              readOnly
              emptyIcon={<StarIcon style={{ opacity: 0.55, color: "gray" }} />}
            />
            {item.professor && (
              <p className="text-gray-300">ผู้สอน: {item.professor}</p>
            )}
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
                    router.push(`/user/1`)}
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
                  <PopupProfile />
                </div>
              )}
            </p>
          </div>
          <hr />
          <div className="flex justify-between mt-2">
            <div>
              <Button variant="light">
                <ThumbUpTwoToneIcon color={isVoted ? "primary" : ""} />{" "}
                {upvoteCount}
              </Button>
            </div>
            <div>
              <ReportButton />
              <ShareButton />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
