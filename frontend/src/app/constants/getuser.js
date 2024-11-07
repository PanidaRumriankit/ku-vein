export default async function GetUserData(email) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/user?email=${encodeURIComponent(email)}`);
    const responseData = await response.json();
    console.log('Received user data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}