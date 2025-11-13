import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const languages = ["en", "ar", "fr", "es", "de", "it", "pt"];

  const pathname = url.pathname;
  
  // تحقق إذا كان المسار يحتوي على لغة مدعومة
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  const hasLanguage = languages.includes(firstSegment);

  if (hasLanguage) {
    // إذا كان المسار يحتوي على لغة، استمر كما هو
    const res = NextResponse.next();
    
    // تحديث الكوكي إذا اختلفت
    if (req.cookies.get("lang")?.value !== firstSegment) {
      res.cookies.set("lang", firstSegment, { 
        path: "/", 
        maxAge: 60 * 60 * 24 * 365 
      });
    }
    return res;
  }

  // إذا لم يكن هناك لغة، أضف اللغة التلقائية
  let lang =
    req.cookies.get("lang")?.value ||
    "en"; // استخدم الإنجليزية كافتراضي مباشرة

  if (!languages.includes(lang)) {
    lang = "en";
  }

  // لا تقم بإعادة التوجيه للمسارات الخاصة
  const isSpecialPath = 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|css|js)$/.test(pathname);
  
  if (isSpecialPath) {
    return NextResponse.next();
  }

  // للمسارات العادية: أضف اللغة
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js)$).*)",
  ],
};