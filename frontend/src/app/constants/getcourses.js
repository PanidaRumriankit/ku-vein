export default async function GetDjangoApiData() {
  const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_ENDPOINT;
  try {
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    console.log('Received data from Django:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}