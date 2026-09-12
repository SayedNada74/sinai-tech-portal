import { MetadataRoute } from 'next';
import { COURSES } from '@/lib/courses-data';
import { getCourseSlug } from '@/lib/courses-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sinai-tech-portal.vercel.app';

  // Primary public pages
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/gpa', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/courses', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/departments', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/study-plan', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/academic-regulations', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/moodle', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/roadmaps', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/careers', priority: 0.7, changeFrequency: 'weekly' as const },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Department landing pages
  const departmentRoutes = [
    'information-technology',
    'computer-science',
    'information-systems',
  ].map((slug) => ({
    url: `${baseUrl}/departments/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Study plan level pages
  const studyPlanRoutes = [1, 2, 3, 4].map((level) => ({
    url: `${baseUrl}/study-plan/level-${level}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic course pages using clean slug URLs
  const courseRoutes = COURSES.map((course) => ({
    url: `${baseUrl}/courses/${getCourseSlug(course)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...departmentRoutes, ...studyPlanRoutes, ...courseRoutes];
}
