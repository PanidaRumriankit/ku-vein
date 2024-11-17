import {reviewURL} from "./backurl.js";

export default async function MakeFilterApiRequest(sort, filter, filter_by) {
  // Construct the URL with the sort and filter parameters
  const sortBy = encodeURIComponent(sort.toLowerCase())
  const filterBy = encodeURIComponent(filter.toLowerCase())

  let url;
  if (filter_by === "course") {
    url = `${reviewURL}?sort=${sortBy}&course_id=${filterBy}`;
  } else if (filter_by === "review") {
    url = `${reviewURL}?sort=${sortBy}&review_id=${filterBy}`;
  } else {
    console.error("Invalid filter_by:", filter_by);
    return [];
  }

  const response = await fetch(url, {});
  if (response.ok) {
    const data = await response.json();
    console.log("Response filter review from backend:", data);
    return data;
  } else {
    console.error("Failed to fetch filter review:", response.status);
    return []
  }
};
