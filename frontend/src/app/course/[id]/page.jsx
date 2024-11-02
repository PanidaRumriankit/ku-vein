"use client"

import Image from "next/image";
import Sorting from "../../components/sorting";
import Search from "../../components/search";
import ReviewCard from "../../components/coursereviewcard";
import MakeFilterApiRequest from "../../constants/getfilterreview";

import {useEffect, useState} from "react";

export default function CoursePage({params}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const key = Array.from(selectedKeys)[0]
      const data = await MakeFilterApiRequest(key, params.id);
      console.log(typeof key, key);
      setReviews(data);
    };

    fetchReviews();
  }, [selectedKeys]);

  return (
    <div className="text-black flex flex-col items-center
    min-h-screen bg-white dark:bg-black dark:text-white">
      <main className="flex flex-col items-center pt-20">
        <Image
          src="/artery.png"
          alt="Artery"
          width={98}
          height={120}
          priority
        />

        <h1 className="mt-4 text-3xl font-bold text-black dark:text-white">KU Vein</h1>

        <p className="mt-4 text-xl text-black dark:text-white">รีวิว แบ่งปัน Q&A</p>

      </main>

      <div className="mt-8 w-full max-w-6xl z-40">
        <Search page='page'/>
      </div>

      <div className="w-full max-w-5xl">
        <Sorting selectedKeys={selectedKeys}
                 setSelectedKeys={setSelectedKeys}/>

        {reviews.length > 0 ? (
          reviews.map((item, index) => (
            <ReviewCard item={item} key={index}/>
          ))
        ) : (
          <p className="text-green-400 text-center">No review currently</p>
        )}

      </div>
    </div>
  );
}