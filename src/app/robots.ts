import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/login',
        '/signup',
        '/contact',
        '/web-published/',
      ],
      disallow: [
        '/api/',
        '/editor/',
        '/demo/',
        '/account',
        '/access-denied',
        '/document-not-found',
        '/reset-password',
      ],
    },
    sitemap: 'https://www.workly.kr/sitemap.xml',
  }
}