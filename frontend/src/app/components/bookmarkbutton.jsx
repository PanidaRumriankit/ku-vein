import { bookmarkURL } from "../constants/backurl";
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function BookmarkButton({ id, type, bookmark }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const idToken = session?.idToken || session?.accessToken;
  const email = session?.email;

  // console.log("ID:", id, "Type:", type, "Bookmark:", bookmark);

  const handleBookmark = async () => {
    if (!email || !idToken) return;
    setIsBookmarked(!isBookmarked);

    try {
      const response = await fetch(bookmarkURL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify({
          id: id,
          data_type: type,
          email: email
        })
      });

    } catch (error) {
      console.error("Error bookmarking:", error);
    }
  };

  useEffect(() => {
    setIsBookmarked(bookmark);
  }, [bookmark]);

  if (!session) {
    return null;
  }

  return (
    <Button onClick={handleBookmark} variant="light" isIconOnly>
      {isBookmarked ? <TurnedInIcon /> : <TurnedInNotIcon />}
    </Button>
  );
};

