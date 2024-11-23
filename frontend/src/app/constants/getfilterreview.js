import {reviewURL} from "./backurl.js";

export default async function MakeFilterApiRequest(sort, filter, option) {
  // Construct the URL with the sort and filter parameters
  const sortBy = encodeURIComponent(sort.toLowerCase())
  const filterBy = encodeURIComponent(filter.toLowerCase())

  let url;
  if (option === "course") {
    url = `${reviewURL}?sort=${sortBy}&course_id=${filterBy}`;
  } else if (option === "review") {
    url = `${reviewURL}?sort=${sortBy}&review_id=${filterBy}`;
  } else if (option === "stats") {
    url = `${reviewURL}/stats?course_id=${filterBy}`;
  } else {
    console.error("Invalid option:", option);
    return [];
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log("Response filter review from backend:", data);
      return data;
    } else {
      console.error("Failed to fetch filter review:", response.status);
      return []
    }
  } catch (e) {
    console.error("Failed to fetch filter request:", e);
  }
};
