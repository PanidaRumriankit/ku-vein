"use client";

import Image from "next/image";
import Search from './components/search';
import {useState, useMemo} from "react";
import Sorting from "./components/sorting.jsx";
import ReviewCard from "./components/reviewcard.jsx";
import {demoReview} from "./constants";

export default function Home() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      <main className="flex flex-col items-center pt-20">
        <Image
          src="/artery.png"
          alt="Artery"
          width={98}
          height={120}
          priority
        />
        <h1 className="mt-4 text-3xl font-bold text-black dark:text-white">KU
          Vein</h1>
        <p className="mt-4 text-xl text-black dark:text-white">รีวิว แบ่งปัน
          Q&A</p>
      </main>

      <div className="mt-8 w-full max-w-6xl">
        <Search />
      </div>

      <Sorting selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} className="z-index-negative"/>
      <ReviewCard course={demoReview.course} reviews={demoReview.reviews}
                  reviewer={demoReview.reviewer}/>
      <ReviewCard course={demoReview.course} reviews={demoReview.reviews}
                  reviewer={demoReview.reviewer}/>
      <ReviewCard course={demoReview.course} reviews={demoReview.reviews}
                  reviewer={demoReview.reviewer}/>
      <ReviewCard course={demoReview.course} reviews={demoReview.reviews}
                  reviewer={demoReview.reviewer}/>
    </div>
  );
}
