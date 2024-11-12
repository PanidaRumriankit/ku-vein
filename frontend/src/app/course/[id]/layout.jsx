"use client";

import Image from "next/image";
import Rating from '@mui/material/Rating';

import Search from "../../components/search";
import StarIcon from "@mui/icons-material/Star";

export default function CourseLayout({children, params}) {
  const courseId = params.id;
  const totalReview = 1;
  const courseName = "Just a random course name";
  const averageGrade = 3.5;

  return (
    <div>
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

          <h1
            className="mt-4 text-3xl font-bold text-black dark:text-white">KU
            Vein</h1>
          <p className="mt-4 text-xl text-black dark:text-white">รีวิว
            แบ่งปัน
            Q&A</p>
        </main>

        <div className="mt-8 w-full max-w-6xl z-50">
          <Search page='page'/>
        </div>

        <div className="p-2 align-left border-box border-4">

          <div className="flex flex-wrap">
            {/*Change the color and course name later*/}
            <div
              className="p-2 bg-red-400 border-red-400 border-solid border rounded text-black">{courseId}</div>
            <div
              className="p-2 text-black dark:text-white">{courseName}</div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between">
              <div>ความพึงพอใจ</div>
              <div>
                <Rating name="read-only" value={3} readOnly
                        emptyIcon={<StarIcon style={{opacity: 0.55, color: 'gray'}}/>}/>
              </div>
            </div>

            <div className="flex justify-between">
              <div>รีวิวทั้งหมด</div>
              {/*Change the total review later*/}
              <div>{totalReview}</div>
            </div>

            <div className="flex justify-between">
              <div>เกรดโดยเฉลี่ย</div>
              {/*Change the total review later*/}
              <div>{averageGrade}</div>
            </div>
          </div>
        </div>

        <div className="w-full">{children}</div>

      </div>
    </div>
  );
}