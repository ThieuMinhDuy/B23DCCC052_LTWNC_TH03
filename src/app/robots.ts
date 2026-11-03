import type { MetadataRoute } from 'next';

// robots.txt generator
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/admin', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
