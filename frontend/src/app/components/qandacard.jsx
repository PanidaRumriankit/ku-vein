"use client"

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Button from "@mui/material/Button";


export default function QuestionCard({item}) {
  const router = useRouter();
  const {data: session} = useSession();
  const [upvoteCount, setUpvoteCount] = useState(item.upvote || 0);
  const [isVoted, setIsVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [isbookmarked, setIsBookmarked] = useState(false);
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

  return (
    <div className="mx-auto my-4 w-[32rem] max-w-4xl text-black dark:text-white">
      <fieldset className="border border-gray-300 rounded-md p-6 w-full bg-white dark:bg-gray-800 shadow-lg cursor-pointer hover:shadow-xl">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <div className="flex items-center cursor-pointer hover:shadow-lg">
              {isbookmarked ? <TurnedInIcon onClick={() => setIsBookmarked(false)}/> : <TurnedInNotIcon onClick={() => setIsBookmarked(true)}/>}
            </div>
          </div>
          <br/>
          <div
            className="flex items-center justify-between text-gray-300 text-right">
            <p className="text-right">
              {new Date(item.createdAt).toLocaleString()}
            </p>
            <p className="text-left">
              โดย: {item.name || item.username}
            </p>
          </div>
          <hr/>
          <div className="text-gray-300 flex justify-between mt-2 -mb-4">
            <div className="text-left text-2xl flex space-x-4">
              <Button variant="light" onClick={handleUpvote}
                      disabled={!session || isLoading}>
                <ThumbUpTwoToneIcon/>    {upvoteCount}
              </Button>
            </div>
            <div className="text-right">
              <ReportButton/>
              <ShareButton/>
            </div>
          </div>
      </fieldset>
    </div>
  );
}
