import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@nextui-org/react";
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';

export default function ShareButton() {
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
          <div className="my-2">
            <FacebookIcon/> Facebook
          </div>
          <div className="my-2">
            <XIcon/> X
          </div>
          <div className="my-2">
            <LinkRoundedIcon/> Copy link
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}