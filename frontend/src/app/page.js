"use client";

import Image from "next/image";
import {useState, useMemo} from "react";
import {Button} from "@nextui-org/button";
import Sorting from "./components/sorting.jsx";
import ReviewCard from "./components/review_card.jsx";

const bacon = "Bacon ipsum dolor amet prosciutto buffalo corned beef beef ham " +
  "hock. Landjaeger sausage boudin bresaola andouille bacon turkey" +
  "pastrami buffalo short loin swine. Short ribs sirloin pork beef" +
  "cow pork chop bresaola swine. Swine sausage turducken hamburger" +
  "tongue shankle tenderloin porchetta picanha frankfurter short" +
  "ribs andouille ham hock bresaola alcatra."

const demo_review = {
  "course": {
    "course_id": "1346012",
    "course_name": "Bacon Ipsum 101",
  },
  "reviews": bacon,
  "reviewer": "Ichi"
}

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["earliest"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  async function GetDjangoApiData() {
    const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_ENDPOINT;
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    console.log("Received data from Django:", responseData);
    setData(responseData);
  }

  // for testing, you can delete this when you want
  async function HandleClick() {
    await GetDjangoApiData();
  }

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
        <div className="inline-flex items-center justify-end text-black">

          {/* for testing you can delete this when you want */}
          <Button onClick={HandleClick} variant="contained"
                  className="text-blue-500">
            test button
          </Button>

          {/* for testing you can delete this when you want */}
          {JSON.stringify(data)}
        </div>

        <input
          type="text"
          placeholder="ค้นหารายวิชา (ชื่อภาษาอังกฤษ/รหัสวิชา)"
          className="w-full h-12 px-4 py-2 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:border-2"
        />
      </div>
      <Sorting selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys}/>
      <ReviewCard course={demo_review.course} reviews={demo_review.reviews} reviewer={demo_review.reviewer}/>
    </div>
  );
}
