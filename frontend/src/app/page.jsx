"use client";

import Image from "next/image";
import Search from './components/search';
import {useState, useEffect} from "react";
import Sorting from "./components/sorting";
import ReviewCard from "./components/reviewcard";
import MakeApiRequest from "./constants/getreview"
import AddReviews from "./components/addreviews";

export default function Home() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const key = Array.from(selectedKeys)[0]
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

      <div className="mt-8 w-full max-w-6xl z-40">
        <Search page='page'/>
      </div>
      <div className="w-full max-w-5xl">
        <Sorting selectedKeys={selectedKeys}
                 setSelectedKeys={setSelectedKeys}/>
        {reviews.map((item, index) => (
          <ReviewCard item={item} key={index}/>
        ))}
      </div>
      <div className="fixed bottom-4 right-4 z-40">
        <AddReviews/>
      </div>
    </div>
  );
}