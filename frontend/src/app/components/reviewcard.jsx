"use client"

import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";

import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

import {upvoteURL} from "../constants/backurl.js"
import {colorPallet} from "../constants";
import MakeApiRequest from '../constants/getupvotestatus';

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
  const color = RandomColor();
  const {data: session} = useSession();
  const [upvoteCount, setUpvoteCount] = useState(item.upvote || 0);
  const [isVoted, setIsVoted] = useState(false);
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
    fetchData();
    setUpvoteCount(item.upvote || 0);
  }, [session, email, item]);

  return (
    <div className="mx-auto my-4 w-full max-w-4xl text-black dark:text-white">
      <fieldset className="border border-gray-300 rounded-md p-4">
        {page === "page" && (
          <legend
            style={{backgroundColor: color, borderColor: color}}
            className="p-2 border-solid border rounded text-black font-bold dark:text-white"
            onClick={handleLegendClick}
          >
            {item.courses_id} | {item.courses_name}
          </legend>
        )}
        <div className="text-black dark:text-white">
          <div className="justify-between flex">
            <Rating value={item.ratings} readOnly
                    emptyIcon={<StarIcon style={{opacity: 0}}/>}/>
            {item.professor &&
              <p className="text-gray-300">ผู้สอน: {item.professor}</p>}
          </div>
          <br/>
          <p>{item.review_text}</p>
          <br/>
          <div
            className="flex items-center justify-between text-gray-300 text-right">
            <p className="text-left">Grade: {item.grades}</p>
            <p
              className="text-right">{item.date} โดย: {item.name || item.username}</p>
          </div>
          <hr/>
          <div className="text-gray-300 flex justify-between mt-2">
            <div className="text-left">
              <Button variant="light" onClick={handleUpvote}
                      disabled={!session || isLoading}>
                <ThumbUpTwoToneIcon/> {upvoteCount}
              </Button>
            </div>
            <div className="text-right">
              <ReportButton/>
              <ShareButton/>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
