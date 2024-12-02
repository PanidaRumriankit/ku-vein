import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@nextui-org/react";

import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

export default function ShareButton({reviewId, reviewText}) {
  // TODO fix the url
  const url = window.location.host + '/review/' + reviewId;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => console.log("Copied"));
  }

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  }

  const shareToX = () => {
    const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(reviewText)}`;
    window.open(xShareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Popover placement="buttom">
      <PopoverTrigger>
        <Button variant="light"
                isIconOnly>
          <ShareTwoToneIcon/>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-black dark:text-white">
          <div>
            <button className="my-2" onClick={shareToFacebook}>
              <FacebookIcon/> Facebook
            </button>
          </div>
          <div>
            <button className="my-2" onClick={shareToX}>
              <XIcon/> X
            </button>
          </div>
          <div>
            <button className="my-2 cursor-pointer" onClick={handleCopy}>
              <LinkRoundedIcon/>
              Copy link
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}