"use client";

import Image from "next/image";
import Rating from '@mui/material/Rating';

import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalFireDepartmentOutlinedIcon
  from '@mui/icons-material/LocalFireDepartmentOutlined';
import {useEffect, useState} from "react";

import Search from "../../components/search";
import GradePieChart from "../../components/piechart";
import MakeFilterApiRequest from "../../constants/getfilterreview";
import {facultyColor} from "../../constants"


const example = {
  "courses_id": "01200101-64",
  "courses_name": "Innovative Thinking",
  "faculties": "คณะวิศวกรรมศาสตร์",
  "total_review": 1,
  "avg_effort": 3,
  "avg_rating": 3,
  "total_grade": {"A": 1, "B": 0},
  "mode_class_type": "online",
  "mode_attendance": 3,
  "mode_criteria": "work-based",
  "mode_rating": 3,
  "mode_faculty": "คณะวิศวกรรมศาสตร์"
}

export default function CourseLayout({children, params}) {
  const courseId = params.id;

  const [stats, setStats] = useState({});
  const [color, setColor] = useState("");
  const [rating, setRating] = useState(0);
  const [effort, setEffort] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await MakeFilterApiRequest("latest", courseId, "stats");
        setStats(data);
        setColor(facultyColor[data.faculties] || "transparent");
        setRating(data.avg_rating || 0);
        setEffort(data.avg_effort || 0);
      } catch (e) {
        console.error("Error fetching reviews", e);
      }
    };

    fetchReviews().then(() => console.log("Fetching success"));
  }, [courseId, params.id]);

  return (
    <div>
      <div className="text-black flex flex-col items-center w-full
                      min-h-screen bg-white dark:bg-black dark:text-white">
        <main className="flex flex-col items-center pt-20">
          <Image
            src="/artery.png"
            alt="Artery"
            width={98}
            height={120}
            priority
          />

          <h1 className="mt-4 text-3xl font-bold text-black dark:text-white">
            KU Vein
          </h1>
          <p className="mt-4 text-xl text-black dark:text-white">
            รีวิว แบ่งปัน Q&A
          </p>
        </main>

        <div className="mt-8 w-full max-w-6xl z-50">
          <Search page='page'/>
        </div>

        <div className="max-w-xl w-full p-2 align-left
                        border-box border-4 border-gray-300 rounded
                        dark:border-gray-400">
          <div className="flex flex-wrap">
            <div className="p-2 border-solid border rounded text-black"
                 style={{
                   backgroundColor: color || "transparent",
                   borderColor: color || "transparent",
                 }}>
              {courseId}
            </div>
            <div className="p-2 text-black dark:text-white">
              {stats.courses_name}
            </div>

          </div>

          <div className="mt-4">
            <div className="flex justify-between">
              <div>ความพึงพอใจ</div>
              <div>
                <Rating name="read-only" value={rating} readOnly
                        emptyIcon={
                          <StarIcon style={{opacity: 0.55, color: 'gray'}}/>
                        }
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>ความพยายาม</div>
              <div>
                <Rating
                  name="read-only" value={effort} readOnly
                  icon={
                    <LocalFireDepartmentIcon/>
                  }
                  emptyIcon={
                    <LocalFireDepartmentOutlinedIcon
                      style={{opacity: 0.55, color: 'gray'}}/>
                  }
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>รีวิวทั้งหมด</div>
              <div>{stats.total_review || 0}</div>
            </div>

            <div className="flex justify-between">
              <div className="items-center text-center">
                เกรด
                <GradePieChart itemData={stats.total_grade}/>
              </div>
            </div>
            {/*  Add more field*/}
          </div>
        </div>

        <div className="w-full">{children}</div>

      </div>
    </div>
  );
}