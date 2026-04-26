import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "/My-Business-Site";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? repoName : undefined,
  assetPrefix: isProd ? repoName : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
