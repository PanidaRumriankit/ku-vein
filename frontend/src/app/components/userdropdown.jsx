"use client";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import PersonIcon from '@mui/icons-material/Person';
import { usersDropdown } from "../constants";

export default function UserDropdown() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <PersonIcon className="w-7 h-7 text-gray-200 hover:text-black hover:cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu
        className="bg-white dark:bg-gray-800 shadow-lg rounded-md outline-none w-28 p-0"
      >
        {usersDropdown.map((item) => (
          <DropdownItem
            key={item.key}
            className={`${
              item.key === "logout" ? "text-red-300 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-700" : ""
            } hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors hover:cursor-pointer px-2 py-1`}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
