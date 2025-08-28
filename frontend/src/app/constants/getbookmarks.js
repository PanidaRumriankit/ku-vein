import {bookmarkURL} from "./backurl.js";

export default async function GetBookmarks(params) {
  try {
    const response = await fetch(bookmarkURL + `?email=${encodeURIComponent(params)}`);
    const responseData = await response.json();
    // console.log('Received data from Django:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}