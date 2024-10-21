import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import {useState} from "react";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

export default function ShareButton({reviews}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Button onClick={() => {setIsOpen(true)}} variant="light">
      <ShareTwoToneIcon/>
    </Button>

  )
}