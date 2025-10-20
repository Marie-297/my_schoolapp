import type { NextConfig } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com", 'res.cloudinary.com'],
  },
};

export default nextConfig;
