"use client"

import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";
import UpvoteButton from "./upvotebutton.jsx";
import Rating from '@mui/material/Rating';
import {colorPallet} from "../constants";

import {useRouter} from "next/navigation";

function RandomColor() {
  const index = Math.floor(Math.random() * colorPallet.length)
  return colorPallet[index];
}

export default function ReviewCard({item, page = null}) {
  const router = useRouter();
  const color = RandomColor()

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
          <Rating name="read-only" value={item.ratings} readOnly/>
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
              <UpvoteButton upvote={item.upvote}/>
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
