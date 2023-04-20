/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "vercel.com","www.jotted.page"],
  },
};

module.exports = nextConfig;
