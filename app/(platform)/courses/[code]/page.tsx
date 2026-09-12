import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES, getCourseBySlug, getAllCourseSlugs, getCourseSlug } from "@/lib/courses-data";
import { CourseDetailInteractive } from "./course-detail-interactive";

// 1. Generate Static Params: Pre-render all 44 courses statically at build time
export function generateStaticParams() {
  const slugs = getAllCourseSlugs();
  return slugs.map((slug) => ({
    code: slug,
  }));
}

// 2. Generate Metadata: Dynamic SEO for each course
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const course = getCourseBySlug(code);

  if (!course) return {};

  return {
    title: `${course.arabic} (${course.code}) | المقررات الدراسية — جامعة سيناء`,
    description: `مقرر ${course.arabic} (${course.english}): ${course.description} تعرف على الساعات المعتمدة والمتطلبات السابقة ومخرجات التعلم.`,
    keywords: [
      `${course.arabic}`, `${course.english}`, `${course.code}`, `مادة ${course.arabic} جامعة سيناء`,
      `كورس ${course.code}`, "مقررات كلية تكنولوجيا المعلومات", "حاسبات سيناء",
    ],
    alternates: {
      canonical: `https://sinai-tech-portal.vercel.app/courses/${getCourseSlug(course)}`,
    },
    openGraph: {
      title: `${course.arabic} | كلية تكنولوجيا المعلومات جامعة سيناء`,
      description: course.description,
      url: `https://sinai-tech-portal.vercel.app/courses/${getCourseSlug(course)}`,
      type: "article",
    },
  };
}

// 3. Server Component Page
export default async function CourseDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const course = getCourseBySlug(code);

  if (!course) {
    notFound();
  }

  // Related courses (same department, up to 3)
  const relatedCourses = COURSES.filter(
    (c) => c.department === course.department && c.code !== course.code
  ).slice(0, 3);

  // Schema.org Course + BreadcrumbList
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.arabic,
      "description": course.description,
      "courseCode": course.code,
      "educationalCredentialAwarded": "Bachelor's Degree",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Faculty of Information Technology & Computer Science - Sinai University",
        "sameAs": "https://sinai-tech-portal.vercel.app"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "courseWorkload": `PT${course.credits}H`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://sinai-tech-portal.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "دليل المقررات", "item": "https://sinai-tech-portal.vercel.app/courses" },
        { "@type": "ListItem", "position": 3, "name": course.arabic, "item": `https://sinai-tech-portal.vercel.app/courses/${getCourseSlug(course)}` },
      ]
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CourseDetailInteractive course={course} relatedCourses={relatedCourses} />
    </>
  );
}
