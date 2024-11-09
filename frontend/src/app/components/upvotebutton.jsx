import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import {Button} from "@nextui-org/button";

export default function UpvoteButton({upvote}) {
  return (
    <Button variant="light">
      <ThumbUpTwoToneIcon/> {upvote}
    </Button>
  )
}