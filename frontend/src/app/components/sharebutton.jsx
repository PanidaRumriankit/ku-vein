import {useState} from "react";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';

export default function ShareButton({reviews}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover placement="buttom">
      <PopoverTrigger>
        <Button onClick={() => {setIsOpen(true)}} variant="light">
          <ShareTwoToneIcon/>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
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