import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["arweave.net", "nftstorage.link"],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
