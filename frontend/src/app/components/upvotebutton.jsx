import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import { Button } from "@nextui-org/button";

export default function UpvoteButton({ upvote, onUpvote }) {
  return (
    <Button variant="light" onClick={onUpvote}>
      <ThumbUpTwoToneIcon /> {upvote}
    </Button>
  );
}