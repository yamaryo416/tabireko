/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xgdtyvvntzucjsgsuhke.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "maps.google.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
