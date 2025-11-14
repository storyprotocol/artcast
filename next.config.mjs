/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/cast/*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=999999, stale-while-revalidate=999999',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=999999',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=999999'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
