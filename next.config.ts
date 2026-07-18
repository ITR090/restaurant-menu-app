import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
    allowedDevOrigins: ['ais-dev-u7oiflg2wmpmctegdxdcm5-469568007236.europe-west3.run.app'],
};
 
export default nextConfig;
