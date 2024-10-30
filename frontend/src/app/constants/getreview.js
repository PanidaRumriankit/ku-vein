export default async function MakeApiRequest(param) {
  // Construct the URL with the query parameter
  const response = await fetch(`http://127.0.0.1:8000/api/review?sort=${encodeURIComponent(param)}`);

  if (response.ok) {
    const data = await response.json();
    console.log("Response from backend:", data);
    return data;
  } else {
    console.error("Failed to fetch:", response.status);
    return []
  }
};
