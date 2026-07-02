import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      allowedOrigins: ['pegasus.cptcr.uk', 'localhost:3000']
    }
  },
  async redirects() {
    return [
      {
        source: "/source",
        destination: "https://github.com/semi-constructor/pegasus",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
