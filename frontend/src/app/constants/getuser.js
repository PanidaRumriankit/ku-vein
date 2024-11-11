import {userURL} from "./backurl.js";

export default async function GetUserData(params, type) {
  try {
    const response = await fetch(userURL + `?${type}=${encodeURIComponent(params)}`);
    const responseData = await response.json();
    console.log('Received user data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}