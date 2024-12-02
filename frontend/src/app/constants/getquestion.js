import {questionURL} from "./backurl.js";

export default async function GetQuestion(sort, id) {
  // Construct the URL with the sort parameter
  const response = await fetch(questionURL + `?course_id=${encodeURIComponent(id)}&mode=${encodeURIComponent(sort)}`);

  if (response.ok) {
    const data = await response.json();
    console.log("Question:", data);
    return data;
  } else {
    console.error("Failed to fetch:", response.status);
    return []
  }
};
