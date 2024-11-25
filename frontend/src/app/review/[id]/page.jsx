"use client";

import {useEffect} from "react";
import MakeFilterApiRequest from "../../constants/getfilterreview";
import Image from "next/image";

export default function ReviewPage({params}) {
  // TODO add stats to the review page
  useEffect(() => {
    const fetchReviews = async () => {
      const data = await MakeFilterApiRequest("latest", params.id, "review");
      console.log(data);
    };

    fetchReviews().then(() => {
      console.log("Fetch Success")
    });
  }, [params.id]);

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-white dark:bg-black">
      <main className="flex flex-col items-center pt-20 mb-10">
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

      <p className="text-5xl text-black dark:text-white">
        {params.id}
      </p>

    </div>
  );
}
