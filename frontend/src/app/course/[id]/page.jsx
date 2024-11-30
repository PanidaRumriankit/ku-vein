"use client";

import Sorting from "../../components/sorting";
import SearchFaculty from "../../components/searchfaculty";
import ReviewCard from "../../components/reviewcard";
import CourseNavigationBar from "../../components/coursenavigation";
import MakeFilterApiRequest from "../../constants/getfilterreview";
import ReviewFilters from "../../components/reviewfilter";

import { useEffect, useState } from "react";
import AddReviews from "../../components/addreviews";

export default function CoursePage({ params }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["latest"]));
  const [reviews, setReviews] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filters, setFilters] = useState({
    rating: null,
    year: null,
    grades: null,
    professor: "",
    criteria: "",
    type: "",
    faculties: "",
  });

  useEffect(() => {
    const fetchReviews = async () => {
      const key = Array.from(selectedKeys)[0];
      const data = await MakeFilterApiRequest(key, params.id, "course");
      setReviews(data);
      setFilteredReviews(data);
    };

    fetchReviews();
    
  }, [params.id, selectedKeys]);

  useEffect(() => {
    if(filteredReviews) {
      console.log("Filters: ", filteredReviews);
    }
  }, [filteredReviews]);

  useEffect(() => {
    let filtered = [...reviews];

    if (filters.rating) {
      filtered = filtered.filter((review) => review.ratings === parseInt(filters.rating));
    }

    if (filters.year) {
      filtered = filtered.filter((review) => review.year === parseInt(filters.year));
    }

    if (filters.grades) {
      filtered = filtered.filter((review) => review.grades === filters.grades);
    }

    if (filters.professor) {
      filtered = filtered.filter((review) =>
        review.professor.toLowerCase().includes(filters.professor.toLowerCase())
      );
    }

    if (filters.criteria) {
      filtered = filtered.filter((review) => review.criteria === filters.criteria);
    }

    if (filters.type) {
      filtered = filtered.filter((review) => review.classes_type === filters.type);
    }

    if (filters.faculties) {
      filtered = filtered.filter((review) => review.faculties === filters.faculties);
    }

    console.log("Faculty: ", filters.faculties, reviews);

    setFilteredReviews(filtered);
  }, [filters, reviews]);

  const professors = [...new Set(reviews.map((review) => review.professor))];

  return (
    <div className="text-black flex flex-col items-center min-h-screen bg-white dark:bg-black dark:text-white">
      <div className="w-full max-w-5xl">
        <div className="justify-start">
          <CourseNavigationBar courseId={params.id} />
        </div>
        <div className="my-4 justify-end">
          <Sorting selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
          <ReviewFilters filters={filters} setFilters={setFilters} professors={professors} />
        </div>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((item, index) => <ReviewCard item={item} key={index} />)
        ) : (
          <p className="text-green-400 text-center">No review currently</p>
        )}

        <div className="fixed bottom-4 right-4 z-40">
          <AddReviews />
        </div>
      </div>
    </div>
  );
}
