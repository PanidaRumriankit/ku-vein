import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import ReportButton from "./reportbutton.jsx";
import ShareButton from "./sharebutton.jsx";
import Rating from '@mui/material/Rating';
import {Button} from "@nextui-org/button";
import {colorPallet} from "../constants";

function RandomColor() {
  const index = Math.floor(Math.random() * colorPallet.length)
  return colorPallet[index];
}

export default function ReviewCard({item}) {
  const color = RandomColor()
  return (
    <div className="my-2 w-full max-w-5xl text-black dark:text-white">
      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend
          style={{backgroundColor: color, borderColor: color}}
          className="p-2 border-solid border rounded text-black font-bold dark:text-white">
          {item.courses_id} | {item.courses_name}
        </legend>
        <div className="text-black dark:text-white">
          <Rating name="read-only" value={item.ratings} readOnly />
          <br/>
          <p>{item.reviews}</p>
          <br/>
          <div
            className="flex items-center justify-between text-gray-500 text-right">
            <p className="text-left">
              Grade: {item.grades}
            </p>
            <p className="text-right">
              {item.date} author: {item.name || item.user_name}
            </p>
          </div>
          <hr/>
          <div className="text-gray-300 flex justify-between mt-2">
            <div className="text-left">
              <Button variant="light">
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
  )
}