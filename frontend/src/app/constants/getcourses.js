export default async function GetDjangoApiData() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/course");
    const responseData = await response.json();
    console.log('Received data from Django:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}