"use client";

import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@nextui-org/react";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {useState} from 'react'

export default function EditDelete() {
  const [isOpen, setIsOpen] = useState(false);

  const iconClasses = "text-xl text-black flex-shrink-0 dark:text-white";
  const textClasses = "text-lg text-black dark:text-white";

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          isIconOnly
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
        >
          {isOpen ? <KeyboardControlKeyIcon/> : <KeyboardArrowDownIcon/>}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded">
        <DropdownItem
          key="edit"
          startContent={<EditIcon className={iconClasses} />}
          className={textClasses}
        >
          Edit Review
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          startContent={<DeleteForeverIcon className={cn(iconClasses, "text-danger")}/>}
        >
          Delete Review
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}