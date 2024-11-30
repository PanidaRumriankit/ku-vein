import {userURL} from "./backurl.js";

export default async function GetUserData(params, type) {
  try {
    const response = await fetch(userURL + `?${type}=${encodeURIComponent(params)}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}