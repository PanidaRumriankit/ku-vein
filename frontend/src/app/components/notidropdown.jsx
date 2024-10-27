"use client";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { notifications } from "../constants";

export default function NotificationDropdown() {
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      return '';
    }
    return date.toLocaleString();
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <NotificationsIcon className="w-7 h-7 text-gray-200 hover:text-black hover:cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu
        className="bg-white dark:bg-zinc-800 shadow-lg rounded-md outline-none w-full p-0"
      >
        {notifications.map((item) => (
          <DropdownItem
            key={item.id}
            className={`
              ${item.isRead ? "bg-white hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700" : "bg-gray-100 hover:bg-white dark:bg-zinc-700 dark:hover:bg-zinc-800"}
              dark:text-white rounded-md transition-colors hover:cursor-pointer px-2 py-1
            `}
          >
            <div className="flex flex-col">
              <span className="font-semibold">{item.title}</span>
              <span className="text-sm text-gray-500">{item.description}</span>
              <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

