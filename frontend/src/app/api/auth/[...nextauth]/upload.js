export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { image } = req.body;
  
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }
  
    try {
      const response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.data.error);
      }
  
      return res.status(200).json({ link: data.data.link });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  