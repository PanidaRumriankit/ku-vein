import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the incoming request body
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json(
                { error: "Image data is required" },
                { status: 400 }
            );
        }

        // Call the Imgur API to upload the image
        const imgurResponse = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image }), // Base64-encoded image
        });

        console.log("Imgur Client ID:", process.env.IMGUR_CLIENT_ID);

        const imgurData = await imgurResponse.json();

        if (!imgurResponse.ok) {
          const errorResponse = await imgurResponse.json();
          console.error("Imgur API Error:", errorResponse);
          return NextResponse.json(
              { error: errorResponse.data?.error || "Unknown error" },
              { status: imgurResponse.status }
          );
      }

        // Return the response from Imgur to the client
        return NextResponse.json(imgurData, { status: 200 });
    } catch (error) {
        console.error("Error uploading to Imgur:", error);
        return NextResponse.json(
            { error: "Failed to upload image to Imgur" },
            { status: 500 }
        );
    }
}