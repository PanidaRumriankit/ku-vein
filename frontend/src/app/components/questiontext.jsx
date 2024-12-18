"use client"

import {useRouter, usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useTheme} from "next-themes";
import ShareButton from "./sharebutton.jsx";
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import {Button} from "@nextui-org/button";
import PopupProfile from "./popupprofile.jsx";
import { questionURL } from "../constants/backurl.js";
import BookmarkButton from "./bookmarkbutton.jsx";
import GetUser from "../constants/getuser";
import EDQuestion from "./edquestion.jsx";

export default function QuestionText({ item, bookmark }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const {data: session} = useSession();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [formattedDate, setFormattedDate] = useState("");
  // const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [userId, setUserId] = useState(null);
  const idToken = session?.idToken || session?.accessToken;
  const email = session?.email;

  const fetchUser = async () => {
    const response = await GetUser(email, "email");
    setUserId(response.id);
  };

  useEffect(() => {
    if (session) {
      fetchUser();
    }
  }, [session]);

  const handleUpvote = async () => {
    if (isLoading || !session) return;
    setIsLoading(true);

    try {
      const response = await fetch(questionURL + '/upvote', {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify({
          question_id: String(item.questions_id),
          user_id: String(userId)
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

  useEffect(() => {
    if (item.post_time) {
      const formatted = new Date(item.post_time).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setFormattedDate(formatted);
    }
  }, [item.post_time]);

  return (
    <div className="mx-auto my-4 w-[32rem] max-w-4xl text-black dark:text-white">
      <fieldset
        className="border border-2 border-blue-300 rounded-md p-6 w-full bg-white dark:bg-gray-800 shadow-xl"
      >
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-[#44b3ab] break-all">{item.questions_title}</h3>
            {/* <div className="ml-4 cursor-pointer hover:scale-105" onClick={(e) => {setIsBookmarked(!isBookmarked)}}>
              {isBookmarked ? <TurnedInIcon /> : <TurnedInNotIcon />}
            </div> */}
          </div>
          <br/>
          <p className="text-lg mb-4">{item.questions_text}</p>
          <div
            className="flex items-center justify-between text-gray-300 text-right">
            <p className="text-right">
              {formattedDate}
            </p>
            <p
            className={!item.anonymous ? "cursor-pointer": ""}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              if (!item.anonymous) {
                e.stopPropagation()
                router.push(`/user/${item.users.toString()}`);}
            }}
          >
            โดย: {item.pen_names}
          </p>
          {!item.anonymous && isHovered && (
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
              <PopupProfile userId={item.users.toString()}/>
            </div>
          )}
          </div>
          <hr/>
          <div className="text-gray-300 flex justify-between -ml-4 mt-2 -mb-4">
{/*             <div className="text-left text-2xl flex space-x-4" onClick={(e) => {e.stopPropagation()}}> */}
{/*               <Button variant="light" onClick={handleUpvote} */}
{/*                       disabled={!session || isLoading}> */}
{/*                 <ThumbUpTwoToneIcon */}
{/*                   color={isVoted ? "primary" : ""}/> {upvoteCount} */}
{/*               </Button> */}
{/*             </div> */}
          <div className="text-right" onClick={(e) => e.stopPropagation()}>
            <BookmarkButton id={item.questions_id} type="qa" bookmark={bookmark}/>
            <EDQuestion userName={item.username} questionId={String(item.questions_id)} item={item} />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
