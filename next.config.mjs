/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d391b93f5f62d9c15f67142e43841acc.ipfscdn.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
