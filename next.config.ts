import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep Next's development indicator out of the customer-facing preview.
  devIndicators: false,
  allowedDevOrigins: [
    "spec-semiconductor-euros-away.trycloudflare.com",
    "exceptions-chest-driving-applying.trycloudflare.com",
  ],
};

export default nextConfig;
