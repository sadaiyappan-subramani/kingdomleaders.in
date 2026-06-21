/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kingdomleaders/ui"],
  async redirects() {
    return [
      {
        source: '/mastertraining/apply',
        destination: '/register',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
