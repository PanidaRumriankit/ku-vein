/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
  };
  
  export default nextConfig;