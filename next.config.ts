import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
images: {
    remotePatterns: [
      {
        protocol: "https", // or http
        hostname: "https://scontent-iad3-2.cdninstagram.com", // if your website has no www, drop it
      },
    ],
  },
};

export default nextConfig;
