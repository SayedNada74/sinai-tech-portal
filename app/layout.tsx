import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans_Arabic, Lexend } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { AppProvider } from "@/context/app-context";
import { AcademicProvider } from "@/context/academic-context";
import { LearningProvider } from "@/context/learning-context";
import { AdminProvider } from "@/context/admin-context";
import { SocialProvider } from "@/context/social-context";
import { ToastProvider } from "@/components/ui/toast";
import { PWAInstaller } from "@/components/pwa-installer";
import { Analytics } from "@vercel/analytics/react";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sinai-tech-portal.vercel.app"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "SU IT Guide",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  },
  title: {
    default: "SU IT Guide | دليل طلاب تكنولوجيا المعلومات وعلوم الحاسب - جامعة سيناء",
    template: "%s | SU IT Guide - جامعة سيناء"
  },
  description: "المنصة الأكاديمية التفاعلية الشاملة لطلاب كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء — حاسبة GPA، دليل المقررات، الخطة الدراسية، اللائحة الأكاديمية، ونظام الساعات المعتمدة.",
  keywords: [
    "جامعة سيناء", "كلية تكنولوجيا المعلومات", "كلية حاسبات ومعلومات", "حاسبات جامعة سيناء",
    "حساب GPA جامعة سيناء", "حاسبة المعدل التراكمي", "معدل تراكمي", "حساب المعدل الفصلي",
    "مواد جامعة سيناء", "مواد حاسبات جامعة سيناء", "مقررات تكنولوجيا المعلومات",
    "خطة دراسية جامعة سيناء", "ساعات معتمدة", "لائحة حاسبات جامعة سيناء",
    "شجرة المتطلبات السابقة", "مواد الفرقة الأولى", "مواد الفرقة الثانية",
    "Data Structures جامعة سيناء", "Computer Networks جامعة سيناء",
    "دليل طلاب جامعة سيناء", "Moodle جامعة سيناء", "K-Moodle",
    "نظام الساعات المعتمدة", "متطلبات التخرج", "الإنذار الأكاديمي", "مرتبة الشرف",
    "Sinai University", "IT Faculty", "GPA Calculator", "Sinai University Courses",
    "Sinai University GPA", "Credit Hours System", "Academic Regulations",
    "Computer Science Sinai", "Information Technology Sinai"
  ],
  authors: [{ name: "Sayed Mahmoud" }],
  verification: {
    google: "QTsHdLCIiaROweR1np2PQZHdjXmjsM-IYGJTes7do-Q",
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "SU IT Guide - دليل طلاب تكنولوجيا المعلومات جامعة سيناء",
    description: "حاسبة GPA، دليل المقررات الدراسية، الخطة الدراسية الكاملة، واللائحة الأكاديمية الرسمية لكلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء.",
    url: "https://sinai-tech-portal.vercel.app",
    siteName: "SU IT Guide",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SU IT Guide - دليل طلاب تكنولوجيا المعلومات جامعة سيناء",
    description: "حاسبة GPA، دليل المقررات، الخطة الدراسية، واللائحة الأكاديمية لطلاب كلية تكنولوجيا المعلومات بجامعة سيناء.",
  },
  icons: {
    icon: "/uni-logo.jpeg",
    shortcut: "/uni-logo.jpeg",
    apple: "/uni-logo.jpeg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      data-scroll-behavior="smooth"
      className={`${ibmPlexArabic.variable} ${lexend.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme script — runs before paint to prevent theme flash (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('app_theme')||localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light-mode');document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light-mode');}var l=localStorage.getItem('app_lang')||'ar';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;}catch(e){}})()`,
          }}
        />
        {/* Global Schema.org JSON-LD: WebSite + EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://sinai-tech-portal.vercel.app/#website",
                  "url": "https://sinai-tech-portal.vercel.app",
                  "name": "SU IT Guide",
                  "alternateName": "دليل طلاب تكنولوجيا المعلومات - جامعة سيناء",
                  "description": "المنصة الأكاديمية الشاملة لطلاب كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء",
                  "inLanguage": ["ar", "en"],
                  "publisher": { "@id": "https://sinai-tech-portal.vercel.app/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://sinai-tech-portal.vercel.app/courses?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "EducationalOrganization",
                  "@id": "https://sinai-tech-portal.vercel.app/#organization",
                  "name": "كلية تكنولوجيا المعلومات وعلوم الحاسب - جامعة سيناء",
                  "alternateName": "Faculty of Information Technology & Computer Science - Sinai University",
                  "url": "https://sinai-tech-portal.vercel.app",
                  "sameAs": ["https://su.edu.eg"],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "القنطرة شرق",
                    "addressRegion": "الإسماعيلية",
                    "addressCountry": "EG"
                  }
                }
              ]
            })
          }}
        />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SU IT Guide" />
        <link rel="icon" type="image/jpeg" href="/uni-logo.jpeg" />
        <link rel="shortcut icon" type="image/jpeg" href="/uni-logo.jpeg" />
        <link rel="apple-touch-icon" href="/uni-logo.jpeg" />
        <link rel="preload" as="image" type="image/jpeg" href="/uni-logo.jpeg" fetchPriority="high" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <AuthProvider>
          <AppProvider>
            <AdminProvider>
              <AcademicProvider>
                <LearningProvider>
                  <SocialProvider>
                    <ToastProvider>
                      {children}
                      <PWAInstaller />
                      <Analytics />
                    </ToastProvider>
                  </SocialProvider>
                </LearningProvider>
              </AcademicProvider>
            </AdminProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
