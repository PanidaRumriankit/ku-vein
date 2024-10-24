"use client";

import Image from "next/image";
import Search from './components/search';
import {useState, useMemo, useEffect} from "react";
import Sorting from "./components/sorting.jsx";
import ReviewCard from "./components/reviewcard.jsx";
import MakeApiRequest from "./constants/getreview"

export default function Home() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const key = selectedKeys.values().next().value
      const data = await MakeApiRequest(key);
      console.log(typeof key, key);
      setReviews(data);
    };

    fetchReviews();
  }, [selectedKeys]);

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
        <Search/>
      </div>
      <Sorting selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys}/>
      {reviews.map((item, index) => (
        <ReviewCard course={item.course_id} reviews={item.reviews} reviewer={item.user_id} faculty={item.faculty} key={index} />
      ))}
    </div>
  );
}
