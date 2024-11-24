"use client";

import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@nextui-org/react";

import {useSession} from "next-auth/react";
import {useEffect, useState} from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {reviewURL} from "../constants/backurl";
import GetUserData from "../constants/getuser";

export default function EditDelete({userName, reviewId}) {
  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession();
  const [currentUser, setCurrentUser] = useState(null);

  const idToken = session?.idToken || session?.accessToken;
  const email = session?.email;

  const iconClasses = "text-xl text-black flex-shrink-0 dark:text-white";
  const textClasses = "text-lg text-black dark:text-white";

  useEffect(() => {
    if (session) {
      async function fetchdata() {
        const userData = await GetUserData(session.user.email, "email");
        setCurrentUser(userData.username);
      }

      fetchdata().then(() => {});
    }
  }, [currentUser, session]);

  const handleDelete = async () => {
    if (!email || !idToken || currentUser !== userName) return;

    try {
      console.log("reviewID", reviewId)
      const response = await fetch(reviewURL, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify({
          review_id: reviewId,
        })
      });

      if (response.ok) {
        console.log("Success");
        window.location.reload();
      } else {
        console.error("Error deleting:", await response.text());
      }
    } catch (error) {
      console.error("Error upvoting review:", error);
    }
  };
  if (!session || session?.email !== userName) return;

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
          startContent={<EditIcon className={iconClasses}/>}
          className={textClasses}
        >
          Edit Review
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          startContent={<DeleteForeverIcon
            className={cn(iconClasses, "text-danger")}/>}
          onClick={handleDelete}
        >
          Delete Review
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}