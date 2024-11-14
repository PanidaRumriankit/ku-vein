"use client"

import Sorting from "../../components/sorting";
import ReviewCard from "../../components/reviewcard";
import CourseNavigationBar from "../../components/coursenavigation";
import MakeFilterApiRequest from "../../constants/getfilterreview";

import {useEffect, useState} from "react";

export default function CoursePage({params}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const key = Array.from(selectedKeys)[0]
      const data = await MakeFilterApiRequest(key, params.id);
      console.log(typeof key, key);
      setReviews(data);
    };

    fetchReviews();
  }, [params.id, selectedKeys]);
  
  return (
    <div className="text-black flex flex-col items-center
    min-h-screen bg-white dark:bg-black dark:text-white">

      <div className="w-full max-w-5xl">
        <div className="justify-start">
          <CourseNavigationBar courseId={params.id}/>
        </div>
        <div className="justify-end">
          <Sorting selectedKeys={selectedKeys}
                   setSelectedKeys={setSelectedKeys}/>
        </div>

        {reviews.length > 0 ? (
          reviews.map((item, index) => (
            <ReviewCard item={item} key={index}/>
          ))
        ) : (
          <p className="text-green-400 text-center">No review currently</p>
        )}

      </div>
    </div>
  );
}