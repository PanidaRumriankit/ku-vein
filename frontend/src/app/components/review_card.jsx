import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import ReportButton from "./reportbutton.jsx";
import {Button} from "@nextui-org/button";
import {colorPallet} from "../constants";

function RandomColor() {
  const index = Math.floor(Math.random() * colorPallet.length)
  return colorPallet[index];
}

export default function ReviewCard({course, reviews, reviewer}) {
  const color = RandomColor()
  return (
    <div className="my-2 w-full max-w-5xl text-black dark:text-white">
      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend
          style={{ backgroundColor: color, borderColor: color}}
          className="p-2 border-solid border rounded text-black font-bold dark:text-white">
          {course.course_id} | {course.course_name}
        </legend>
        <div className="text-black dark:text-white">
          <p>{reviews}</p>
          <br/>
          <p className="text-gray-300 text-right">{reviewer}</p>
          <hr/>
          <div className="text-gray-300 flex justify-between">
            <div className="text-left">
              <Button variant="light">
                <ThumbUpTwoToneIcon/>
              </Button>
            </div>
            <div className="text-right">
              <ReportButton/>
              <Button>
                <ShareTwoToneIcon/>
              </Button>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )
}