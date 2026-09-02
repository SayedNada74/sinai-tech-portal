import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";
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

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
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
    default: "SU IT Guide | دليل ومرشد طلاب جامعة سيناء",
    template: "%s | SU IT Guide"
  },
  description: "المنصة الأكاديمية التفاعلية الشاملة لطلاب تكنولوجيا المعلومات والحاسب الآلي بجامعة سيناء لتتبع خطتهم الدراسية وحساب معدلهم التراكمي.",
  keywords: ["جامعة سيناء", "تكنولوجيا المعلومات", "حاسبات ومعلومات", "معدل تراكمي", "خطة دراسية", "ساعات معتمدة", "Sinai University", "IT", "GPA Calculator", "PWA"],
  authors: [{ name: "Sayed Mahmoud" }],
  verification: {
    google: "QTsHdLCIiaROweR1np2PQZHdjXmjsM-IYGJTes7do-Q",
  },
  openGraph: {
    title: "SU IT Guide - منصة طالب تكنولوجيا المعلومات",
    description: "تتبع خطتك الدراسية، احسب معدلك التراكمي، واحصل على إرشاد أكاديمي ذكي بجامعة سيناء.",
    url: "https://sinai-tech-portal.vercel.app",
    siteName: "SU IT Guide",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SU IT Guide - منصة طالب تكنولوجيا المعلومات",
    description: "البوابة الأكاديمية الشاملة لطلاب تكنولوجيا المعلومات بجامعة سيناء.",
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
      className={`${ibmPlexArabic.variable} ${jakarta.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme script — runs before paint to prevent theme flash (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('app_theme')||localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light-mode');document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light-mode');}var l=localStorage.getItem('app_lang')||'ar';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;}catch(e){}})()`,
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
