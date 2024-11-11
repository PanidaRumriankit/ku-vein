import {courseURL} from "./backurl.js";

export default async function GetDjangoApiData() {
  try {
    const response = await fetch(courseURL);
    const responseData = await response.json();
    console.log('Received data from Django:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}