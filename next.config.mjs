/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'photoarchive4c2f5d3aebc8449b999af373198c73226328a-dev.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
