import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "Cruiser Copilot",
  },
};

export default nextConfig;
