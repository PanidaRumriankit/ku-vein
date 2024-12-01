import {noteURL} from "./backurl.js";

export default async function MakeNoteApiRequest(filter=null) {
  // Construct the URL with the sort and filter parameters
  let url;
  if (filter) {
    const filterBy = encodeURIComponent(filter.toLowerCase())
    url = `${noteURL}?course_id=${filterBy}`;
  } else {
    url = noteURL;
  }

  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    console.log("Response filter note from backend:", data);
    return data;
  } else {
    console.error("Failed to fetch filter note:", response.status);
    return []
  }
};
