import {questionURL} from "./backurl.js";

export default async function GetQuestion(sort) {
  // Construct the URL with the sort parameter
  const response = await fetch(questionURL + `?mode=${encodeURIComponent(sort)}`);

  if (response.ok) {
    const data = await response.json();
    console.log("Question:", data);
    return data;
  } else {
    console.error("Failed to fetch:", response.status);
    return []
  }
};
