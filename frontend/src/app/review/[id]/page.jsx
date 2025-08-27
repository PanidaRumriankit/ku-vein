"use client";

import {useEffect, useState} from "react";

import {attendant, facultyColor} from "../../constants/index";
import MakeFilterApiRequest from "../../constants/getfilterreview";

import Image from "next/image";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocalFireDepartmentOutlinedIcon
  from "@mui/icons-material/LocalFireDepartmentOutlined";

export default function ReviewPage({params}) {
  const [stats, setStats] = useState({});
  const [color, setColor] = useState("");
  const [rating, setRating] = useState(0);
  const [effort, setEffort] = useState(0);
  const [chips, setChips] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await MakeFilterApiRequest("latest", params.id, "review");
      if (data) {
        setStats(data);
        setColor(facultyColor[data.faculties || ""] || "transparent");
        setRating(data.ratings || 0);
        setEffort(data.efforts || 0);
        setChips([data.criteria, data.classes_type, attendant[data.attendances]]);
      }
      console.log("Fetched review data", data);
    };

    fetchReviews().then(() => {
    });
  }, [params.id]);

  return (
    <div
      className="text-black dark:text-white flex flex-col items-center min-h-screen bg-white dark:bg-black">
      <main className="flex flex-col items-center pt-20 mb-10 mx-20">
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

      <div className="max-w-xl w-full p-2 align-left
                        border-box border-4 border-gray-300 rounded
                        dark:border-gray-400">
        <div className="flex flex-wrap w-full">
          <div className="w-3/4 text-black dark:text-white items-start">
            <div className="p-2 border-solid border rounded"
                 style={{
                   backgroundColor: color || "transparent",
                   borderColor: color || "transparent",
                 }}>
              {stats.faculties || "ไม่มีคณะ"}
            </div>
            <div className="p-2">
              {stats.courses_id || "ไม่มีวิชา"} {stats.courses_name || ""}
            </div>
          </div>
          <div className="w-1/4 text-right right-0 break-all items-end mt-2">
            <strong>โดย:</strong> {stats.name || stats.username || "ไม่มี"}
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

          <fieldset className="my-4 border rounded-md p-4 bg-gray-100
          dark:bg-gray-700 border-gray-300 dark:border-gray-500">
            <legend className="text-lg font-semibold mb-2">
              รีวิว
            </legend>
            <div className="mb-2 break-all">
              {stats.review_text || "ไม่มีรีวิวขณะนี้"}
            </div>
          </fieldset>

          <div className="flex w-full">
            <p className="mt-1 mr-1">tags:</p>
            {chips.length > 0 ? (
              chips.map((item, index) => (
                <Chip
                  label={item}
                  key={index}
                  className="mx-1"
                  color="success"
                />
              ))
            ) : (
              <Chip label="ไม่มี"/>
            )}
          </div>

          {/*  Add more field here */}
        </div>
      </div>
    </div>
  );
}
