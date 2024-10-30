export default async function GetDjangoApiData() {
  try {
    // get courses with type param
    // TODO implement user to select the type of course
    const response = await fetch("http://127.0.0.1:8000/api/course");
    const responseData = await response.json();
    console.log('Received data from Django:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}