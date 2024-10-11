"use client";

import Image from "next/image";
import {useState, useMemo} from "react";
import {Button} from "@nextui-org/button";
import Sorting from "./components/sorting";

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
    <div className="flex flex-col items-center min-h-screen bg-white">
      <main className="flex flex-col items-center pt-20">
        <Image
          src="/artery.png"
          alt="Artery"
          width={98}
          height={120}
          priority
        />
        <h1 className="mt-4 text-3xl font-bold text-black">KU Vein</h1>
        <p className="mt-4 text-xl text-black">รีวิว แบ่งปัน Q&A</p>
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
      <Sorting selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
    </div>
  );
}
