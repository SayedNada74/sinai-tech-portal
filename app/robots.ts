import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/courses/',
          '/gpa',
          '/departments/',
          '/study-plan/',
          '/academic-regulations',
          '/faq',
          '/moodle',
          '/roadmaps/',
          '/careers/',
        ],
        disallow: [
          '/admin/',
          '/dashboard/',
          '/profile/',
          '/settings/',
          '/saved-items/',
          '/auth/',
          '/api/',
          '/directory/',
          '/community/',
          '/calendar/',
          '/events/',
          '/jobs/',
          '/leaderboards/',
          '/resources/',
          '/ai-assistant/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://sinai-tech-portal.vercel.app/sitemap.xml',
  };
}
