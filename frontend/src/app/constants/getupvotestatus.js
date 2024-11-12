import {upvoteURL} from "./backurl.js";

export default async function MakeApiRequest(email, review_id) {
  // Construct the URL with the sort parameter
  const userEmail = encodeURIComponent(email);
  const rId = encodeURIComponent(review_id);
  const response = await fetch(upvoteURL + `?email=${userEmail}&review_id=${rId}`);

  if (response.ok) {
    const data = await response.json();
    console.log("Upvote status:", data, typeof data);
    return data;
  } else {
    console.error("Failed to fetch:", response.status);
    return null
  }
};