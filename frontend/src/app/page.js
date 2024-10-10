"use client";

import Image from "next/image";
import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';
import { useState, useRef } from "react";
import Popup from './components/popup';

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleFocus = () => {
    setIsPopupOpen(true);
  };

  const handleBlur = () => {
    setIsPopupOpen(false);
  };

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
        <input
          type="text"
          placeholder="ค้นหารายวิชา (ชื่อภาษาอังกฤษ/รหัสวิชา)"
          className="w-full h-12 px-4 py-2 text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:border-2"
        />
      </div>
      <div className="w-full max-w-6xl flex justify-end my-4 text-black">
        <p className="font-bold">Sorting</p>
        <button className="mx-4 focus:outline-none" onFocus={handleFocus} ref={buttonRef} onBlur={handleBlur}>
          <TuneTwoToneIcon className="w-7 h-7" />
        </button>
        {isPopupOpen && <Popup setIsPopupOpen={setIsPopupOpen} buttonRef={buttonRef.current} />}
      </div>
    </div>
  );
}
