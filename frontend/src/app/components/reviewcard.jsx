"use client"

import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";

import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import {colorPallet} from "../constants";

import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import {useState} from "react"

function RandomColor() {
  const index = Math.floor(Math.random() * colorPallet.length)
  return colorPallet[index];
}

export default function ReviewCard({item, page = null}) {
  const router = useRouter();
  const color = RandomColor()
  const [upvoteCount, setUpvoteCount] = useState(item.upvote || 0);

  const handleUpvote = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({reviewId: item.id, email: item.email}), // Adjust the payload as needed
      });

      if (response.ok) {
        setUpvoteCount(upvoteCount + 1); // Increase count locally on success
      } else {
        const errorText = await response.text();
        console.log("Error upvoting:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error upvoting review:", error);
    }
  };

  const handleLegendClick = () => {
    router.push(`/course/${item.courses_id}`);
  };

  return (
    <div className="mx-auto my-4 w-full max-w-4xl text-black dark:text-white">
      <fieldset className="border border-gray-300 rounded-md p-4">
        {page === "page" &&
          <legend
            style={{backgroundColor: color, borderColor: color}}
            className="p-2 border-solid border rounded text-black font-bold dark:text-white"
            onClick={handleLegendClick}
          >
            {item.courses_id} | {item.courses_name}
          </legend>
        }
        <div className="text-black dark:text-white">
          <div className="justify-between flex">
            <Rating value={item.ratings}
                    readOnly
                    emptyIcon={<StarIcon style={{opacity: 0}}/>}
            />
            {item.professor &&
              <p className="text-gray-300">Instructor: {item.professor}</p>}
          </div>
          <br/>
          <p>{item.review_text}</p>
          <br/>
          <div
            className="flex items-center justify-between text-gray-300 text-right">
            <p className="text-left">Grade: {item.grades}</p>
            <p className="text-right">
              {item.date} author: {item.name || item.username}
            </p>
          </div>
          <hr/>
          <div className="text-gray-300 flex justify-between mt-2">
            <div className="text-left">
              <Button variant="light" onClick={handleUpvote}>
                <ThumbUpTwoToneIcon/> {item.upvote}
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
