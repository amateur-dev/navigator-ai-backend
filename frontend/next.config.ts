import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*'],
  turbopack: {
    resolveAlias: {
      // Alias .js extension to .mjs for markdown-it internal imports
      'markdown-it/lib/common/utils.js': 'markdown-it/lib/common/utils.mjs'
    }
  },
  rewrites: async () => {
    return [
      // This is for SEO purposes to rewrite /post to /blog while keeping the content. We don't want to break existing links and SEO rankings.
      {
        source: '/post/:path*',
        destination: '/blog/:path*'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  serverExternalPackages: ['@prisma/client']
}

export default nextConfig
