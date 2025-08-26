"use client"

import {
  Navbar,
  NavbarContent,
  NavbarItem
} from "@nextui-org/react";
import Link from "next/link"
import {usePathname} from "next/navigation";

export default function CourseNavigationBar({courseId}) {
  const pathname = usePathname(); // get current URL path
  const isActive = (route) => pathname === route;
  const isActivate = (path) => pathname.startsWith(path);

  return (
    <div className="flex text-black dark:text-white">
      <Navbar isBordered position="static">
        <NavbarContent justify="start">
          <NavbarContent className="flex gap-3">
            <NavbarItem>
              <Link
                href={`/course/${courseId}`}
                color="foreground"
                className={isActive(`/course/${courseId}`) ? "text-blue-500 font-bold" : ""}
              >
                Reviews
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href={`/course/${courseId}/qanda`}
                color="foreground"
                className={isActivate(`/course/${courseId}/qanda`) ? "text-blue-500 font-bold" : ""}
              >
                Q&A
              </Link>
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>
      </Navbar>
    </div>
  );
}