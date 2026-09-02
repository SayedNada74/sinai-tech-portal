import { MetadataRoute } from 'next';
import { COURSES } from '@/lib/courses-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://su-it-guide.vercel.app';

  // Base routes
  const routes = [
    '',
    '/courses',
    '/directory',
    '/community',
    '/careers',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic course routes
  const courseRoutes = COURSES.map((course) => ({
    url: `${baseUrl}/courses/${course.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...courseRoutes];
}
