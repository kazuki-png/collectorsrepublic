import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "arweave.net" },
      { hostname: "nftstorage.link" },
    ],
  },
  turbopack: {},
};

export default nextConfig;
