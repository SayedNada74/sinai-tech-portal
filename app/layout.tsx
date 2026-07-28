import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { AppProvider } from "@/context/app-context";
import { AcademicProvider } from "@/context/academic-context";
import { LearningProvider } from "@/context/learning-context";
import { AdminProvider } from "@/context/admin-context";
import { SocialProvider } from "@/context/social-context";
import { ToastProvider } from "@/components/ui/toast";

const ibmPlexArabic = { variable: "font-ibm-plex" };
const jakarta = { variable: "font-jakarta" };

export const metadata: Metadata = {
  title: {
    default: "SU IT Guide | دليل ومرشد طلاب جامعة سيناء",
    template: "%s | SU IT Guide"
  },
  description: "المنصة الأكاديمية التفاعلية الشاملة لطلاب تكنولوجيا المعلومات والحاسب الآلي بجامعة سيناء لتتبع خطتهم الدراسية وحساب معدلهم التراكمي.",
  keywords: ["جامعة سيناء", "تكنولوجيا المعلومات", "حاسبات ومعلومات", "معدل تراكمي", "خطة دراسية", "ساعات معتمدة", "Sinai University", "IT", "GPA Calculator"],
  authors: [{ name: "Sayed Mahmoud" }],
  openGraph: {
    title: "SU IT Guide - منصة طالب تكنولوجيا المعلومات",
    description: "تتبع خطتك الدراسية، احسب معدلك التراكمي، واحصل على إرشاد أكاديمي ذكي بجامعة سيناء.",
    url: "https://su-it-guide.vercel.app",
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
    icon: "/favicon.ico",
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
      className={`${ibmPlexArabic.variable} ${jakarta.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme script — runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('app_theme') || localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light-mode');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light-mode');
                  }
                  
                  var lang = localStorage.getItem('app_lang') || 'ar';
                  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                } catch(e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
        <AuthProvider>
          <AppProvider>
            <AdminProvider>
              <AcademicProvider>
                <LearningProvider>
                  <SocialProvider>
                    <ToastProvider>{children}</ToastProvider>
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
