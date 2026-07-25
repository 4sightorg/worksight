import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';
import path from 'path';

const isAnalyze = process.env.ANALYZE === 'true';

const nextConfig: NextConfig = {
  transpilePackages: ['@worksight/common', '@worksight/assets'],
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', '@dnd-kit/core'],
  },

  // Development server configuration
  allowedDevOrigins: [
    'http://localhost:3001',
    'http://192.168.1.2:3001',
    ...(process.env.NEXT_PUBLIC_DEV_URL
      ? [
        process.env.NEXT_PUBLIC_DEV_URL,
        process.env.NEXT_PUBLIC_DEV_URL.includes(':')
          ? process.env.NEXT_PUBLIC_DEV_URL.replace(/:\d+$/, '')
          : null,
      ].filter(Boolean)
      : []),
  ] as string[],

  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  // Bundle analyzer in development
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    const commonDist = path.resolve(__dirname, '../../packages/common/dist');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@worksight/assets': path.resolve(__dirname, '../../packages/assets/dist'),
      '@worksight/common/data': path.resolve(commonDist, 'data'),
      '@worksight/common/types': path.resolve(commonDist, 'types'),
      '@worksight/common/utils': path.resolve(commonDist, 'utils'),
      '@worksight/common': commonDist,
    };
    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({ enabled: isAnalyze })(nextConfig);
