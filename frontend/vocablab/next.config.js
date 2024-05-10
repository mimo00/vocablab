/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["ec2-50-112-70-248.us-west-2.compute.amazonaws.com", "localhost:3000"]
    }
  },
  output: "standalone",
}

module.exports = nextConfig;
