import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const languages = ["en", "ar", "fr", "es", "de", "it", "pt"];

  // ✅ الحصول على اللغة من الـ cookie أو المتصفح
  let lang =
    req.cookies.get("lang")?.value ||
    req.headers.get("accept-language")?.split(",")[0]?.slice(0, 2) ||
    "en";

  // ✅ التأكد من أن اللغة مدعومة
  if (!languages.includes(lang)) {
    lang = "en";
  }

  // ✅ استخراج اللغة من الـ URL
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const pathLang = pathSegments[0];
  
  // ✅ إذا كان الـ URL يحتوي على لغة صحيحة
  if (languages.includes(pathLang)) {
    const res = NextResponse.next();
    // تحديث الـ cookie لتطابق اللغة في الـ URL
    if (req.cookies.get("lang")?.value !== pathLang) {
      res.cookies.set("lang", pathLang, { 
        path: "/", 
        maxAge: 60 * 60 * 24 * 365 // سنة واحدة
      });
    }
    return res;
  }

  // ✅ إعادة التوجيه للـ URL مع اللغة
  url.pathname = `/${lang}${url.pathname}`;
  const res = NextResponse.redirect(url);
  res.cookies.set("lang", lang, { 
    path: "/", 
    maxAge: 60 * 60 * 24 * 365 
  });
  
  return res;
}

export const config = {
  // ✅ استبعاد الملفات الثابتة والـ API
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)",
  ],
};