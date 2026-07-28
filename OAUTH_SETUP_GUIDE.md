# 📘 الدليل الشامل لربط تسجيل الدخول بـ (Google & GitHub) مع Supabase & Next.js

هذا الدليل المرجعي يحتوي على جميع الخطوات بالترتيب من الألف إلى الياء لربط تسجيل الدخول بـ Google و GitHub في أي مشروع مستقبلي.

---

## 🟢 الجزء الأول: الحصول على رابط المزامنة (Callback URL) من Supabase
1. افتح **[Supabase Dashboard](https://supabase.com)** واختر مشروعك.
2. اذهب للقائمة الجانبية: **Authentication** ➔ **Providers**.
3. انسخ رابط **`Callback URL (for OAuth)`** الموجود بأسفل أي مزود هويّة (شكل الرابط):
   ```text
   https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback
   ```

---

## 🐙 الجزء الثاني: خطوات ربط GitHub OAuth (60 ثانية)

1. افتح رابط تطبيقات GitHub المباشر: **[github.com/settings/applications/new](https://github.com/settings/applications/new)**.
2. املأ الخانات الأربعة كالتالي:
   - **Application name**: اكتب اسم مشروعك (مثال: `My Project`).
   - **Homepage URL**: اكتب رابط موقعك (أثناء التطوير: `http://localhost:3000` أو رابط موقعك `https://my-domain.com`).
   - **Application description**: (اختياري).
   - **Authorization callback URL**: ألصق رابط الـ Callback URL المنسوخ من Supabase.
3. اضغط الزر الأخضر **`Register application`**.
4. انسخ المفتاحين الناتجين:
   - **Client ID**: انسخ الكود الظاهر (مثال: `Iv1.8a9b0c1d2e3f`).
   - **Client Secret**: اضغط زر **`Generate a new client secret`** وانسخ الكود الطويل الذي سيظهر.
5. ارجع إلى Supabase ➔ **Authentication** ➔ **Providers** ➔ **GitHub**:
   - قم بتفعيل المفتاح (**Enable GitHub**).
   - ضع الـ **Client ID** والـ **Client Secret** واضغط **Save**.

---

## 🌐 الجزء الثالث: خطوات ربط Google OAuth (دقيقتان)

### 1️⃣ إعداد شاشة الموافقة (Google OAuth Consent Screen):
1. افتح موقع **[Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)**.
2. اذهب إلى **OAuth consent screen** (أو **Branding**):
   - اختر نوع المستخدم **`External`** واضغط **Create**.
   - املأ 3 بيانات بسيطة:
     - **App name**: اكتب اسم مشروعك.
     - **User support email**: اختر بريدك الإلكتروني.
     - **Developer contact information**: اكتب بريدك الإلكتروني.
   - اضغط **Save and Continue** في جميع الخطوات التالية حتى تكتمل الشاشة.

### 2️⃣ إنشاء المفاتيح (OAuth Client ID):
1. اذهب إلى **Credentials** (أو **Clients**) من القائمة الجانبية اليسرى.
2. اضغط في الأعلى على **`Create Credentials`** ➔ اختر **`OAuth client ID`**.
3. اختر **Application type**: **`Web application`**.
4. اكتب اسم مشروعك في **Name**.
5. في قسم **`Authorized redirect URIs`**:
   - اضغط زر **`ADD URI`**.
   - ألصق رابط الـ Callback URL المنسوخ من Supabase:
     ```text
     https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback
     ```
6. اضغط زر **`CREATE`**.
7. انسخ المفتاحين الناتجين:
   - **Client ID**: ينتهي بـ `.apps.googleusercontent.com`.
   - **Client Secret**.
8. ارجع إلى Supabase ➔ **Authentication** ➔ **Providers** ➔ **Google**:
   - قم بتفعيل المفتاح (**Enable Google**).
   - ضع الـ **Client ID** والـ **Client Secret** واضغط **Save**.

---

## 💻 الجزء الرابع: كود الربط في مشاريـع Next.js

في كود أي تطبيق Next.js مستقبلي، بمجرد الضغط على زر تسجيل الدخول استدعِ هذه الدالة المباشرة من مكتبة `@supabase/supabase-js`:

```typescript
import { createClient } from "@supabase/supabase-js";

// 1. تهيئة عميل Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. دالة تسجيل الدخول بـ Google
export async function handleGoogleLogin() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
}

// 3. دالة تسجيل الدخول بـ GitHub
export async function handleGithubLogin() {
  await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
}
```
