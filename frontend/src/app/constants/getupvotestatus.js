export default async function MakeApiRequest(email, review_id) {
  // Construct the URL with the sort parameter
  const userEmail = encodeURIComponent(email);
  const rId = encodeURIComponent(review_id);
  const response = await fetch(`http://127.0.0.1:8000/api/upvote?email=${userEmail}&review_id=${rId}`);

  if (response.ok) {
    const data = await response.json();
    console.log("Upvote status:", data, typeof data);
    return data;
  } else {
    console.error("Failed to fetch:", response.status);
    return null
  }
};