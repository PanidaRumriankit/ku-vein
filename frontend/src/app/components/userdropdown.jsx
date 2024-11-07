"use client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import PersonIcon from "@mui/icons-material/Person";
import { usersDropdown } from "../constants";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const router = useRouter();

  return (
    <Dropdown>
      <DropdownTrigger>
        <PersonIcon className="w-7 h-7 text-gray-200 hover:text-black hover:cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu className="bg-white dark:bg-zinc-800 shadow-lg rounded-md outline-none w-full p-0">
        {usersDropdown.map((item) => (
          <DropdownItem
            key={item.key}
            className={` 
              ${item.key === "logout" ? "!text-red-300 hover:!text-red-500" : ""}
              hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-white rounded-md transition-colors hover:cursor-pointer px-2 py-1
            `}
            onClick={() => {
              if (item.key === "logout") {
                signOut("google");
              } else {
                router.push(`/${item.key}`);
              }
            }}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
