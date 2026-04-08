// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['chart.js', 'react-chartjs-2'],
};

export default nextConfig;