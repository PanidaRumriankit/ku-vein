import {reviewURL} from "./backurl.js";

export default async function MakeFilterApiRequest(sort, filter) {
  // Construct the URL with the sort and filter parameters
  const sortBy = encodeURIComponent(sort.toLowerCase())
  const filterBy = encodeURIComponent(filter.toLowerCase())
  const response = await fetch(reviewURL + `?sort=${sortBy}&course_id=${filterBy}`, {});

  if (response.ok) {
    const data = await response.json();
    console.log("Response filter review from backend:", data);
    return data;
  } else {
    console.error("Failed to fetch filter review:", response.status);
    return []
  }
};
