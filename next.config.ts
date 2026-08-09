import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable CSRF protection for server actions
  },
  async headers() {
    return [
      {
        source: "/api/upload",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
