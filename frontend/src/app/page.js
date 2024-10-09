import Image from "next/image";

export default function Home() {
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
    </div>
  );
}
