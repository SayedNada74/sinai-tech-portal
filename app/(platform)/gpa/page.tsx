import type { Metadata } from "next";
import { GpaInteractive } from "./gpa-interactive";

export const metadata: Metadata = {
  title: "حاسبة المعدل التراكمي (GPA) | جامعة سيناء",
  description: "احسب وتوقع معدلك التراكمي والفصلي بسهولة. محاكي متقدم لتقدير الدرجات المطلوبة لتحقيق هدفك الأكاديمي في كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء.",
  keywords: ["حاسبة gpa", "gpa calculator", "حساب المعدل التراكمي", "جامعة سيناء", "sinai university gpa", "محاكي الدرجات"],
  alternates: {
    canonical: "https://sinai-tech-portal.vercel.app/gpa",
  },
  openGraph: {
    title: "حاسبة المعدل التراكمي (GPA) - جامعة سيناء",
    description: "احسب وتوقع معدلك التراكمي والفصلي بكل سهولة للطلاب في جامعة سيناء.",
    url: "https://sinai-tech-portal.vercel.app/gpa",
    type: "website",
  },
};

export default function GpaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Sinai Tech Portal GPA Calculator",
    "description": "An advanced GPA calculator and simulator tailored for students at Sinai University Faculty of IT & Computer Science.",
    "url": "https://sinai-tech-portal.vercel.app/gpa",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GpaInteractive />
    </>
  );
}
