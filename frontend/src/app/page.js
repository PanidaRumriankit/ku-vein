"use client";

import Image from "next/image";
import {useState, useMemo, useEffect} from "react";
import {useSession} from "next-auth/react";
import {Button} from "@nextui-org/button";
import Sorting from "./components/sorting.jsx";
import ReviewCard from "./components/reviewcard.jsx";
import {demoReview} from "./constants";


export default function Home() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["earliest"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  async function GetDjangoApiData() {
    const apiUrl = "http://127.0.0.1:8000/api/database/course_data";
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    console.log("Received data from Django:", responseData);
    setData(responseData);
  }

  const makeApiRequest = async () => {
        if (session) {
            const idToken = session.idToken;
            const email = session.email;

            const response = await fetch("http://127.0.0.1:8000/api/database/cou", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                    "email": email,
                },
            });

            if (response.status === 401) {
                // Token has expired, handle re-login or token refresh
                console.log("Session expired, please log in again.");
                // Redirect to login if you want Apple
            } else {
                const data = await response.json();
                console.log(data);
                setData(data);
            }
        }

        else {
            console.log("No Session")
        }
    };

  // for testing, you can delete this when you want
  async function HandleClick() {
    await GetDjangoApiData();
  }

  async function HandleClickToken() {
    await makeApiRequest();
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

         <div className="inline-flex items-center justify-end text-black">

          {/* for testing you can delete this when you want */}
          <Button onClick={HandleClickToken} variant="contained"
                  className="text-blue-500">
            test token button
          </Button>

          {/* for testing you can delete this when you want */}
          {JSON.stringify(data)}
        </div>

        <input
          type="text"
          placeholder="ค้นหารายวิชา (ชื่อภาษาอังกฤษ/รหัสวิชา)"
          className="w-full h-12 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-none focus:border-2"
        />
      </div>
      <Sorting selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys}/>
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
