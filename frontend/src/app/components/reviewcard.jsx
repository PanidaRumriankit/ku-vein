"use client";

import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";

import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import {upvoteURL} from "../constants/backurl.js"
import {colorPallet, facultyColor} from "../constants";
import MakeApiRequest from '../constants/getupvotestatus';
import EditDelete from "../components/editdelete"

import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

function RandomColor() {
  const index = Math.floor(Math.random() * colorPallet.length);
  return colorPallet[index];
}

export default function ReviewCard({item, page = null}) {
  const router = useRouter();
  const color = facultyColor[item.faculties] || RandomColor();
  const {data: session} = useSession();
  const [upvoteCount, setUpvoteCount] = useState(item.upvote || 0);
  const [isVoted, setIsVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
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
    if (item.date) {
      const formatted = new Date(item.date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      setFormattedDate(formatted);
    }
  }, [item.date]);

  return (
    <div
      className="items-center mx-auto my-4 w-full max-w-4xl text-black dark:text-white">
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
        <div className="text-black dark:text-white w-full">
          <div className="justify-between flex">
            <Rating value={item.ratings} readOnly
                    emptyIcon={<StarIcon
                      style={{opacity: 0.55, color: 'gray'}}/>}/>
            {item.professor &&
              <p className="text-gray-400">ผู้สอน: {item.professor}</p>}
          </div>
          <br/>
          <div className="w-full break-all">
            {item.review_text}
          </div>
          <br/>
          <div
            className="flex items-center justify-between text-gray-400 text-right">
            <p className="text-left w-20">เกรด: {item.grades}</p>
            <p
              className="text-right w-80 flex-wrap break-words">{formattedDate} โดย: {item.name || item.username}</p>
          </div>
          <hr/>
          <div className="flex justify-between mt-2">
            <div className="text-left">
              <Button variant="light" onClick={handleUpvote}
                      disabled={!session || isLoading}>
                <ThumbUpTwoToneIcon
                  color={isVoted ? "primary" : ""}/> {upvoteCount}
              </Button>
            </div>
            <div className="text-right">
              <ReportButton/>
              <ShareButton reviewId={item.reviews_id} reviewText={item.review_text} />
              <EditDelete userName={item.username} reviewId={item.reviews_id} item={item}/>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
