"use client"

import Image from "next/image";
import Search from './components/search';

export default function Home() {

  return (
    <div className="flex flex-col items-center min-h-screen dark:bg-black">
      <main className="flex flex-col items-center pt-20">
        <Image
          src="/artery.png"
          alt="Artery"
          width={98}
          height={120}
          priority
        />
        <h1 className="mt-4 text-3xl font-bold dark:text-white">KU Vein</h1>
        <p className="mt-4 text-xl dark:text-white">รีวิว แบ่งปัน Q&A</p>
      </main>
      <div className="mt-8 w-full max-w-6xl">
        <Search />
      </div>
    </div>
  );
}