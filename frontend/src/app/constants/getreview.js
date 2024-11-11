import {reviewURL} from "./backurl.js";

export default async function MakeApiRequest(sort) {
  // Construct the URL with the sort parameter
  const response = await fetch(reviewURL + `?sort=${encodeURIComponent(sort)}`);

  if (response.ok) {
    const data = await response.json();
    console.log("Response from backend:", data);
    return data;
  } else {
    console.error("Failed to fetch:", response.status);
    return []
  }
};
