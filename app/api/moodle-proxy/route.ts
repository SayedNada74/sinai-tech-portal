import { NextRequest, NextResponse } from "next/server";

// Comprehensive list of disallowed private / loopback / link-local IP patterns and hostnames
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "::",
  "169.254.169.254", // Cloud Metadata IP (AWS, GCP, Azure)
  "metadata.google.internal",
  "instance-data",
  "localhost.localdomain"
]);

function isPrivateOrReservedIP(ip: string): boolean {
  // IPv4 Private & Reserved Ranges:
  // 10.0.0.0 - 10.255.255.255 (10.0.0.0/8)
  // 172.16.0.0 - 172.31.255.255 (172.16.0.0/12)
  // 192.168.0.0 - 192.168.255.255 (192.168.0.0/16)
  // 127.0.0.0 - 127.255.255.255 (127.0.0.0/8 - Loopback)
  // 169.254.0.0 - 169.254.255.255 (169.254.0.0/16 - Link-Local / Cloud Metadata)
  // 0.0.0.0 - 0.255.255.255 (0.0.0.0/8)
  // 100.64.0.0 - 100.127.255.255 (Shared Address Space)
  // 192.0.0.0 - 192.0.0.255 (IETF Protocol Assignments)
  // 198.18.0.0 - 198.19.255.255 (Benchmarking)
  // 224.0.0.0 - 239.255.255.255 (Multicast)
  // 240.0.0.0 - 255.255.255.255 (Reserved)

  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipv4Regex);
  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);
    const octet3 = parseInt(match[3], 10);
    const octet4 = parseInt(match[4], 10);

    if (octet1 > 255 || octet2 > 255 || octet3 > 255 || octet4 > 255) return true;
    if (octet1 === 0) return true; // 0.0.0.0/8
    if (octet1 === 10) return true; // 10.0.0.0/8
    if (octet1 === 127) return true; // 127.0.0.0/8
    if (octet1 === 169 && octet2 === 254) return true; // 169.254.0.0/16
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true; // 172.16.0.0/12
    if (octet1 === 192 && octet2 === 168) return true; // 192.168.0.0/16
    if (octet1 === 100 && octet2 >= 64 && octet2 <= 127) return true; // 100.64.0.0/10
    if (octet1 >= 224) return true; // Multicast / Reserved
  }

  // IPv6 Private & Loopback Checks
  const lower = ip.toLowerCase();
  if (
    lower === "::1" ||
    lower === "::" ||
    lower.startsWith("fe80:") || // Link-local
    lower.startsWith("fc00:") || // Unique local address
    lower.startsWith("fd00:") ||
    lower.startsWith("::ffff:127.") || // IPv4-mapped loopback
    lower.startsWith("::ffff:10.") ||
    lower.startsWith("::ffff:192.168.") ||
    lower.startsWith("::ffff:172.")
  ) {
    return true;
  }

  return false;
}

/**
 * Validates whether a given URL is safe and legitimate for Moodle calendar sync
 */
function validateSafeMoodleUrl(rawUrl: string): { isValid: boolean; error?: string; parsedUrl?: URL } {
  try {
    const parsed = new URL(rawUrl);

    // 1. Strict Protocol check: HTTPS only
    if (parsed.protocol !== "https:") {
      return { isValid: false, error: "يجب أن يبدأ الرابط ببروتوكول آمن HTTPS حصراً." };
    }

    const hostname = parsed.hostname.toLowerCase().trim();

    // 2. Reject blocked hostnames
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return { isValid: false, error: "هذا النطاق الداخلي محظور لأسباب أمنية." };
    }

    // 3. Reject local or private IP addresses
    if (isPrivateOrReservedIP(hostname)) {
      return { isValid: false, error: "عناوين الشبكات الخاصة والمحلية (Private IPs) محظورة تماماً." };
    }

    // 4. Reject local network suffix extensions
    if (
      hostname.endsWith(".local") ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".lan") ||
      hostname.endsWith(".corp") ||
      hostname.endsWith(".home")
    ) {
      return { isValid: false, error: "النطاقات الداخلية المحلية غير مسموح بها." };
    }

    // 5. Educational and LMS Domain & Path verification
    // Must be a recognized university, LMS, or Moodle domain
    const isAllowedDomain =
      hostname.endsWith(".edu.eg") ||
      hostname.endsWith(".sinai.edu.eg") ||
      hostname.endsWith(".su.edu.eg") ||
      hostname.endsWith(".moodle.org") ||
      hostname.includes("moodle") ||
      hostname.includes("lms");

    const path = parsed.pathname.toLowerCase();
    const isCalendarPath =
      path.includes("calendar") ||
      path.includes("export") ||
      path.endsWith(".ics") ||
      parsed.searchParams.has("authtoken") ||
      parsed.searchParams.has("userid");

    if (!isAllowedDomain || !isCalendarPath) {
      return {
        isValid: false,
        error: "الرابط المدخل غير مصرح به. يسمح فقط بروابط تقويم Moodle والأنظمة الجامعية الرسمية المعتمدة (.edu.eg / Moodle / LMS)."
      };
    }

    return { isValid: true, parsedUrl: parsed };
  } catch (e: any) {
    return { isValid: false, error: "صيغة الرابط غير صحيحة (Invalid URL)." };
  }
}

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json(
      { error: "معامل الرابط (url) مفقود في الطلب." },
      { status: 400 }
    );
  }

  // 1. Validate Target URL against SSRF
  const validation = validateSafeMoodleUrl(urlParam);
  if (!validation.isValid || !validation.parsedUrl) {
    return NextResponse.json(
      { error: validation.error || "الرابط غير آمن أو غير مسموح به." },
      { status: 403 }
    );
  }

  try {
    const targetUrl = validation.parsedUrl.toString();

    // 2. Fetch with AbortController timeout & strict redirect validation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second strict timeout

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SinaiTechPortal-CalendarSync/2.0 (+https://su-it-guide.vercel.app)",
        "Accept": "text/calendar, text/plain, */*"
      },
      redirect: "manual" // Prevent open redirect-based SSRF
    });

    clearTimeout(timeoutId);

    // 3. Handle manual redirect validation
    if (res.status >= 300 && res.status < 400) {
      const redirectLocation = res.headers.get("location");
      if (!redirectLocation) {
        return NextResponse.json(
          { error: "فشل التحويل: الرابط لا يحتوي على مسار إعادة توجيه صالح." },
          { status: 400 }
        );
      }

      // Re-validate redirect target against SSRF!
      const redirectValidation = validateSafeMoodleUrl(redirectLocation);
      if (!redirectValidation.isValid || !redirectValidation.parsedUrl) {
        return NextResponse.json(
          { error: "تم حظر إعادة التوجيه إلى عنوان غير آمن (SSRF Redirect Blocked)." },
          { status: 403 }
        );
      }

      // Fetch verified redirect target
      const redirectRes = await fetch(redirectValidation.parsedUrl.toString(), {
        headers: {
          "User-Agent": "SinaiTechPortal-CalendarSync/2.0 (+https://su-it-guide.vercel.app)",
          "Accept": "text/calendar, text/plain, */*"
        }
      });

      if (!redirectRes.ok) {
        return NextResponse.json(
          { error: `فشل جلب التقويم من سيرفر الجامعة (HTTP ${redirectRes.status}).` },
          { status: redirectRes.status }
        );
      }

      const textData = await redirectRes.text();
      return processCalendarResponse(textData);
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `تعذر الاتصال بخادم Moodle (رمز الاستجابة ${res.status}). يرجى التأكد من صلاحية الرابط.` },
        { status: res.status }
      );
    }

    const data = await res.text();
    return processCalendarResponse(data);
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "انتهت مهلة الاتصال بسيرفر Moodle (Request Timeout). السيرفر يستغرق وقتاً طويلاً للاستجابة." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: `حدث خطأ أثناء مزامنة التقويم: ${error.message || "فشل الاتصال"}` },
      { status: 500 }
    );
  }
}

/**
 * Validates and formats the iCalendar response
 */
function processCalendarResponse(data: string): NextResponse {
  // Check maximum response size (2 MB limit to prevent memory exhaustion)
  if (data.length > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "حجم ملف التقويم كبير جداً ويتجاوز الحد المسموح به (2MB)." },
      { status: 413 }
    );
  }

  // Basic structure check for valid iCalendar format
  if (!data.includes("BEGIN:VCALENDAR") && !data.includes("BEGIN:VEVENT") && !data.includes("SUMMARY")) {
    return NextResponse.json(
      { error: "البيانات المستلمة ليست بصيغة تقويم صالحة (iCalendar format required). يرجى التأكد من تصدير تقويم Moodle بشكل صحيح." },
      { status: 422 }
    );
  }

  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "private, max-age=900", // 15 min cache
      "X-Content-Type-Options": "nosniff"
    }
  });
}
