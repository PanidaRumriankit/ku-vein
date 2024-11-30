"use client"

import Sorting from "../../components/sorting";
import SearchFaculty from "../../components/searchfaculty";
import ReviewCard from "../../components/reviewcard";
import CourseNavigationBar from "../../components/coursenavigation";
import MakeFilterApiRequest from "../../constants/getfilterreview";

import {useEffect, useState} from "react";
import AddReviews from "../../components/addreviews";

export default function CoursePage({params}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [reviews, setReviews] = useState([]);
  const [faculty, setFaculty] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const key = Array.from(selectedKeys)[0];
      const data = await MakeFilterApiRequest(key, params.id, "course");
      console.log(typeof key, key);
      setReviews(data);
    };

    fetchReviews().then(r => {console.log("Fetch review success")});
  }, [params.id, selectedKeys]);
  return (
    <div className="text-black flex flex-col items-center
    min-h-screen bg-white dark:bg-black dark:text-white">

      <div className="w-full max-w-5xl">
        <div className="justify-start">
          <CourseNavigationBar courseId={params.id}/>
        </div>
        <div className="justify-end">
          <SearchFaculty onFacultySelect={(faculty) => setFaculty(faculty.name)} />
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

        <div className="fixed bottom-4 right-4 z-40">
          <AddReviews/>
        </div>
      </div>
    </div>
  );
}