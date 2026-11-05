/** @type {import('next').NextConfig} */

// Applied to every response — hardening + sensible privacy defaults.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // WebP only. AVIF was first, and the optimiser took ~8s to encode each new image
    // and width into it (measured on a 2MB product PNG; WebP: ~1s), so every first view
    // of a page sat on blank image boxes. AVIF's ~30% smaller files don't pay for that.
    formats: ['image/webp'],
    // Trim the default device-width matrix to the sizes we actually render.
    deviceSizes: [360, 430, 640, 768, 1024, 1280, 1440, 1920],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  experimental: {
    // Tree-shake the barrel imports of our heaviest client dependencies.
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // These filenames are NOT content-hashed, so `immutable` would pin a stale
        // image for a year after any replacement. Revalidate instead.
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
