/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 15, no need for experimental flag
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
