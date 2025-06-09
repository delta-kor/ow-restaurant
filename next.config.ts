import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          as: '*.js',
          loaders: ['@svgr/webpack'],
        },
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })
    return config
  },
  async rewrites() {
    return [
      {
        source: '/:lang/book',
        destination: '/:lang/book/0',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/infinite',
        destination: 'https://gist.github.com/delta-kor/03ed6185fd684720c7a1287afe889166',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
